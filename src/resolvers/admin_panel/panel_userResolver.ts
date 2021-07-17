import { User } from "../../entity";
import { ErrCode, Err } from "../../errors";
import {
  PanelUpdateUserInput,
  PayloadResponse,
  SuccessResponse,
} from "../../types";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

import { getConnection } from "typeorm";
import { Authorization } from "../../entity";
import { isAuthorized } from "../../middlewares";

/*
queries: 
  panel_user
  panel_users
mutations:
  panel-updateUser
  panel_deleteUser
*/
@Resolver()
export class panel_userResolver {
  @Query(() => PayloadResponse)
  @isAuthorized(["viewAllUsers"])
  async panel_user(@Arg("id") id: string): Promise<PayloadResponse> {
    try {
      const user = await User.findOne({
        where: { id },
        relations: ["authorization"],
      });

      if (!user) throw new Err(ErrCode.NOT_FOUND, " No User Matched this ID.");

      return { payload: user };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Query(() => [User])
  @isAuthorized(["viewAllUsers"])
  async panel_users(): Promise<User[]> {
    return await User.find();
  }

  // @Query(() => Authorization, { nullable: true })
  // panel_myAuthorization(@Ctx() { req }: MyContext) {
  //   return req.user!.authorization;
  // }

  @Mutation(() => PayloadResponse)
  @isAuthorized(["updateUser"])
  async panel_updateUser(
    @Arg("properties", () => PanelUpdateUserInput)
    { id, fields, authorization }: PanelUpdateUserInput
  ): Promise<PayloadResponse> {
    try {
      const existedUser = await User.findOne({
        where: { id },
        relations: ["authorization"],
      });
      if (!existedUser)
        throw new Err(ErrCode.NOT_FOUND, "Invalid UUID for User.");

      //matching the partial form for validation fn
      // const userForm = {
      //   username: fields.username || existedUser.username,
      //   email: fields.email?.normalize().toLowerCase() || existedUser.email,
      //   password: existedUser.password,
      // };

      // //validating the form
      // const formErrors = await myValidator(userForm, createUserRules);
      // if (formErrors) return { errors: formErrors };

      await getConnection().getRepository(User).update({ id }, fields);

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
        where: { id },
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
  @isAuthorized(["deleteUser"])
  async panel_deleteUser(@Arg("id") id: string): Promise<SuccessResponse> {
    try {
      const result = await User.delete({ id });

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
