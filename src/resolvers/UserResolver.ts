import { User } from "../entity/User";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserResponse } from "../types/UserResponse";
import { CreateUserInput, UpdateUserInput } from "../types/UserInputs";
import { hash, compare } from "bcryptjs";
import { Err } from "../errors/Err";
import { ErrCode } from "../errors/codes";
import { getConnection } from "typeorm";
import { SuccessResponse } from "../types/successResponse";
import { MyContext } from "src/types/MyContext";

@Resolver()
export class UserResolver {
  @Query(() => UserResponse)
  async me(@Ctx() { req }: MyContext): Promise<UserResponse> {
    try {
      if (!req.session.userId)
        throw new Err(ErrCode.NOT_LOGGED_IN, "Not User Logged IN.");

      const user = await User.findOne({ where: { uuid: req.session.userId } });

      if (!user) throw new Err(ErrCode.NOT_FOUND, "No User Matched this ID.");

      return {
        payload: user,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Query(() => UserResponse)
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
  async users(): Promise<User[]> {
    return await User.find();
  }

  @Query(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user)
        throw new Err(ErrCode.INVALID_LOGIN, "Invalid Email or password.");

      const verified = compare(password, user.password);

      if (!verified)
        throw new Err(ErrCode.INVALID_LOGIN, "Invalid Email or Password.");

      req.session.userId = user.uuid;

      return {
        payload: user,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("properties") { username, password, email, role }: CreateUserInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    console.log(req.session);
    try {
      const hashedPassword = await hash(password, 12);
      const user = User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });
      await user.save();

      return {
        payload: user,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => UserResponse)
  async updateUser(
    @Arg("properties", () => UpdateUserInput) params: UpdateUserInput
  ): Promise<UserResponse> {
    try {
      const exists = await User.findOne({ where: { uuid: params.uuid } });
      if (!exists) throw new Err(ErrCode.NOT_FOUND, "Invalid UUID for User.");

      await getConnection()
        .getRepository(User)
        .update({ uuid: params.uuid }, params.properties);

      const user = await User.findOne({ where: { uuid: params.uuid } });
      return {
        payload: user,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => SuccessResponse)
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
