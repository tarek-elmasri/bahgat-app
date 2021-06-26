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
  RegisterInput,
  UpdateUserInput,
  MyContext,
  LoginInput,
  PayloadResponse,
} from "../types";
import { User, Cart } from "../entity";
import { ErrCode, Err } from "../errors";
import { getConnection } from "typeorm";
import { updateSession, isGuest } from "../middlewares";
import { normalizeEmail, syncCart } from "../utils";
import {
  createUserRules,
  myValidator,
  updateUserRules,
} from "../utils/validators/myValidator";
import { Login, Register } from "../auth";

/*
queries:
    me

mutations:
    login
    register
    updateMe
    resetPassword
*/

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

  @Mutation(() => PayloadResponse)
  @UseMiddleware(isGuest)
  async login(
    @Arg("input") credentials: LoginInput,
    @Ctx() { req, res }: MyContext
  ): Promise<PayloadResponse> {
    try {
      const user = await Login(credentials);
      await syncCart(user, req, res); // syncing guest cart with user cart after successful login followed by updating session and cookies

      return {
        payload: user,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => PayloadResponse)
  @UseMiddleware(isGuest)
  async register(
    @Arg("input") input: RegisterInput,
    @Ctx() { req, res }: MyContext
  ): Promise<PayloadResponse> {
    try {
      const { session } = req;

      const formErrors = await myValidator(input, createUserRules); //validating form
      if (formErrors) return { errors: formErrors };

      const user = await Register(input); // create new user in database

      await Cart.update({ uuid: session.cartUuid }, { userUuid: user.uuid }); //linking the current cart in session with the new user

      //updating session data to have the new userId
      session.refresh_token = user.refresh_token;
      await updateSession(session, user, req, res);

      return {
        payload: user,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  //TODO add authorization same user or admin
  @Mutation(() => PayloadResponse)
  async updateMe(
    @Arg("fields", () => UpdateUserInput) fields: UpdateUserInput,
    @Ctx() { req }: MyContext
  ): Promise<PayloadResponse> {
    try {
      const { user } = req;
      const updatedFields = fields;

      if (!user)
        throw new Err(ErrCode.NOT_FOUND, "No user found for current request.");

      //validating the form
      const formErrors = await myValidator(fields, updateUserRules);
      if (formErrors) return { errors: formErrors };

      //normalizing email if email is updated
      fields.email
        ? (updatedFields.email = normalizeEmail(fields.email))
        : null;

      //update user
      await getConnection()
        .getRepository(User)
        .update({ uuid: user.uuid }, updatedFields);

      return {
        payload: await User.findOne({ where: { uuid: user.uuid } }),
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  // @Mutation()
  // async resetPassword(
  //   @Arg("input") input: {oldPassword: string , newPassword:string}
  //   @Ctx() {req}:MyContext
  // ): Promise<PayloadResponse>{

  //   try {
  //     const formErrors = await myValidator(input , {newPassword: "required|minLength:4"})
  //     if (formErrors) return {errors: formErrors}

  //     if (!req.user) throw new Err(ErrCode.NOT_AUTHORIZED, "UnAuthorized action")
  //     const matched = compare(input.oldPassword , req.user.password)

  //     if (!matched) throw new Err(ErrCode.NOT_FOUND, "Invalid password for this user")

  //   } catch (err) {

  //   }

  // }
}
