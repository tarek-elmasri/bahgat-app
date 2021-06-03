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
  SuccessResponse,
  MyContext,
  Role,
  UserResponse,
} from "../types";
import { User, Cart } from "../entity";
import { hash, compare } from "bcryptjs";
import { Err } from "../errors/Err";
import { ErrCode } from "../errors/codes";
import { getConnection } from "typeorm";
import { isAdmin, isGuest, isStaff } from "../middlewares/authorization";

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
    const user = await User.findOne({
      where: { uuid: req.session.userUuid },
    });

    const cart = await Cart.findOne({
      where: {
        uuid: req.session.cartUuid,
      },
      relations: ["cartItems"],
    });

    return { data: user, cart };
  }

  @Query(() => UserResponse)
  @UseMiddleware(isStaff)
  async user(@Arg("uuid") uuid: string): Promise<UserResponse> {
    try {
      const user = await User.findOne({ where: { uuid } });

      if (!user) throw new Err(ErrCode.NOT_FOUND, " No User Matched this ID.");

      return { payload: user };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Query(() => [User])
  @UseMiddleware(isAdmin)
  async users(): Promise<User[]> {
    return await User.find();
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isGuest)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    try {
      const user = await User.findOne({
        where: { email: email.toLowerCase() },
      });

      if (!user)
        throw new Err(ErrCode.INVALID_LOGIN, "Invalid Email or password.");

      const verified = compare(password, user.password);

      if (!verified)
        throw new Err(ErrCode.INVALID_LOGIN, "Invalid Email or Password.");

      req.session.userUuid = user.uuid;
      req.session.role = user.role as Role;
      //TODO sync user cart with session cart

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
    @Arg("properties") { username, password, email }: CreateUserInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    console.log(req.session);
    try {
      const hashedPassword = await hash(password, 12);
      const user = User.create({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        sessionId: req.sessionID,
        role: Role.USER,
      });
      await user.save();
      req.session.userUuid = user.uuid;
      req.session.role = Role.USER;

      return {
        payload: user,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  //TODO add authorization same user or admin
  @Mutation(() => UserResponse)
  async updateUser(
    @Arg("properties", () => UpdateUserInput) params: UpdateUserInput
  ): Promise<UserResponse> {
    try {
      const exists = await User.findOne({ where: { uuid: params.uuid } });
      if (!exists) throw new Err(ErrCode.NOT_FOUND, "Invalid UUID for User.");

      await getConnection()
        .getRepository(User)
        .update({ uuid: params.uuid }, params.fields);

      const user = await User.findOne({ where: { uuid: params.uuid } });
      return {
        payload: user,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => SuccessResponse)
  @UseMiddleware(isAdmin)
  async deleteUser(@Arg("uuid") uuid: string): Promise<SuccessResponse> {
    try {
      const result = await User.delete({ uuid });

      if (result.affected! < 1)
        throw new Err(ErrCode.NOT_FOUND, "No User matches this UUID");

      return {
        ok: true,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }
}
