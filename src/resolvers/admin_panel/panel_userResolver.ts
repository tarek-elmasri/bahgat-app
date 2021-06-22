import { User } from "../../entity";
import { ErrCode } from "../../errors/codes";
import { Err } from "../../errors/Err";
import { isAdmin, isStaff } from "../../middlewares/authorization";
import {
  MyContext,
  PanelUpdateUserInput,
  SuccessResponse,
  UserResponse,
} from "../../types";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import {
  createUserRules,
  myValidator,
} from "../../utils/validators/myValidator";
import { getConnection } from "typeorm";
import { Authorization } from "../../entity/Authorization";
import { isAuthorized } from "../../middlewares/newAuthorization";

@Resolver()
export class panel_userResolver {
  @Query(() => UserResponse)
  @UseMiddleware(isStaff)
  async panel_user(@Arg("uuid") uuid: string): Promise<UserResponse> {
    try {
      const user = await User.findOne({
        where: { uuid },
        relations: ["authorization"],
      });

      if (!user) throw new Err(ErrCode.NOT_FOUND, " No User Matched this ID.");

      return { payload: user };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Query(() => [User])
  @UseMiddleware(isAdmin)
  async panel_users(): Promise<User[]> {
    return await User.find();
  }

  @Query(() => Authorization, { nullable: true })
  panel_myAuthorization(@Ctx() { req }: MyContext) {
    return req.user!.authorization;
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isAuthorized(["updateUser"]))
  async panel_updateUser(
    @Arg("properties", () => PanelUpdateUserInput)
    { uuid, fields, authorization }: PanelUpdateUserInput
  ): Promise<UserResponse> {
    try {
      const existedUser = await User.findOne({
        where: { uuid },
        relations: ["authorization"],
      });
      if (!existedUser)
        throw new Err(ErrCode.NOT_FOUND, "Invalid UUID for User.");

      //matching the partial form for validation fn
      const userForm = {
        username: fields.username || existedUser.username,
        email: fields.email?.normalize().toLowerCase() || existedUser.email,
        password: existedUser.password,
      };

      //validating the form
      const formErrors = await myValidator(userForm, createUserRules);
      if (formErrors) return { errors: formErrors };

      await getConnection().getRepository(User).update({ uuid }, fields);

      // checking if user doesnt have authorization if there is an authorization update
      // to create new before the update
      if (!existedUser.authorization && authorization) {
        existedUser.authorization = await Authorization.create(
          authorization
        ).save();
        await existedUser.save();
      } else if (existedUser.authorization && authorization) {
        await getConnection()
          .getRepository(Authorization)
          .update({ id: existedUser.authorizationId }, authorization);
      }

      const user = await User.findOne({
        where: { uuid },
        relations: ["authorization"],
      });
      return {
        payload: user,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => SuccessResponse)
  @UseMiddleware(isAdmin)
  async panel_deleteUser(@Arg("uuid") uuid: string): Promise<SuccessResponse> {
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
