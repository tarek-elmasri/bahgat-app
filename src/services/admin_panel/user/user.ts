import { User } from "../../../entity";
import { isAuthorized } from "../../../middlewares/authorizations";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { uuidSchema } from "../../../utils/validators";
import { UpdateAuthorizationInput } from "./types/inputs.type";
import {
  UpdateAuthorizationErrors,
  UpdateAuthorizationResponse,
} from "./types/responses.type";

@Resolver()
export class UserPanel {
  @Query(() => User, { nullable: true })
  @isAuthorized(["viewAllUsers"])
  async user(@Arg("id") id: string): Promise<User | undefined> {
    const targetUser = await User.create({ id }).validateInput(uuidSchema);
    if (targetUser.getErrors()) return undefined;

    return await User.preload(targetUser);
  }

  @Query(() => [User])
  @isAuthorized(["viewAllUsers"])
  async users(): Promise<User[]> {
    return await User.find();
  }

  @Mutation(() => UpdateAuthorizationResponse)
  //@isAuthorized(["updateUser"])
  async updateUserAuthorization(
    @Arg("properties") { id, role, authorization }: UpdateAuthorizationInput
  ): Promise<UpdateAuthorizationResponse> {
    const targetUser = await User.create({
      id,
      role,
      authorization,
    }).validateInput(uuidSchema);
    targetUser.validateAuthorization();
    const errors = targetUser.getErrors(UpdateAuthorizationErrors);
    if (errors) return { errors };

    const user = await User.preload(targetUser);
    if (!user)
      return {
        errors: {
          code: "NOT_FOUND",
          message: "No User found for this ID.",
          id: ["No user match this ID."],
        },
      };

    await user.save();

    // checking if user doesnt have authorization if there is an authorization update
    // to create new before the update
    // if (!existedUser.authorization && authorization) {
    //   existedUser.authorization = await Authorization.create(
    //     authorization
    //   ).save();
    //   await existedUser.save();
    // } else if (existedUser.authorization && authorization) {
    //   await getConnection()
    //     .getRepository(Authorization)
    //     .update({ id: existedUser.authorizationId }, authorization);
    // }

    // const user = await User.findOne({
    //   where: { id },
    //   relations: ["authorization"],
    // });
    return {
      payload: user,
    };
  }
}
