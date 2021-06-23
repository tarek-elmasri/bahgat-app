import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import {
  CreateUserInput,
  UpdateUserInput,
  MyContext,
  Role,
  UserResponse,
  LoginInput,
} from "../types";
import { User, Cart } from "../entity";
import { hash, compare } from "bcryptjs";
import { ErrCode, Err } from "../errors";
import { getConnection } from "typeorm";
import { updateSession, isGuest } from "../middlewares";
import { syncCart } from "../utils";
import { createUserRules, myValidator } from "../utils/validators/myValidator";

@ObjectType()
class MeResponse {
  @Field(() => User, { nullable: true })
  data: User | undefined;

  @Field(() => Cart, { nullable: true })
  cart: Cart | undefined;
}

@Resolver()
export class UserResolver {
  @Query(() => MeResponse, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<MeResponse> {
    const cart = await Cart.findOne({
      where: {
        uuid: req.session.cartUuid,
      },
      relations: ["cartItems"],
    });

    return { data: req.user, cart };
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isGuest)
  async login(
    @Arg("input") input: LoginInput,
    @Ctx() { req, res }: MyContext
  ): Promise<UserResponse> {
    try {
      const user = await User.findOne({
        where: { email: input.email.normalize().toLowerCase() },
        relations: ["authorization"],
      });

      if (!user)
        throw new Err(ErrCode.INVALID_LOGIN, "Invalid Email or password.");

      const verified = compare(input.password, user.password);

      if (!verified)
        throw new Err(ErrCode.INVALID_LOGIN, "Invalid Email or Password.");

      //TODO sync user cart with session cart
      //update session data
      req.user = user;
      await syncCart(req, res);

      return {
        payload: user,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isGuest)
  async register(
    @Arg("input") input: CreateUserInput,
    @Ctx() { req, res }: MyContext
  ): Promise<UserResponse> {
    try {
      const formErrors = await myValidator(input, createUserRules);
      if (formErrors) return { errors: formErrors };

      const { username, email, password } = input;
      const hashedPassword = await hash(password, 12);
      const user = await User.create({
        username,
        email: email.normalize().toLowerCase(),
        password: hashedPassword,
        role: Role.USER,
        authorization: undefined,
      }).save();

      //linking the current cart in session with the new user
      await Cart.update(
        { uuid: req.session.cartUuid },
        { userUuid: user.uuid }
      );
      //updating session data to have the new userId
      req.session.refresh_token = user.refresh_token;
      await updateSession(req.session, user, req, res);

      return {
        payload: user,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  //TODO add authorization same user or admin
  @Mutation(() => UserResponse)
  async updateMe(
    @Arg("properties", () => UpdateUserInput) { fields }: UpdateUserInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    try {
      let { user } = req;
      if (!user)
        throw new Err(ErrCode.NOT_FOUND, "No user found for current request.");

      //matching the partial form for validation fn
      const userForm = {
        username: fields.username || user.username,
        email: fields.email.normalize().toLowerCase() || user.email,
        password: fields.password || user.password,
      };

      //validating the form
      const formErrors = await myValidator(userForm, createUserRules);
      if (formErrors) return { errors: formErrors };

      // TODO: hashing password if updated
      await getConnection()
        .getRepository(User)
        .update({ uuid: user.uuid }, fields);

      user = await User.findOne({ where: { uuid: user.uuid } });
      return {
        payload: user,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }
}
