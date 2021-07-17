import { CurrentUser, deleteSession } from "../../middlewares";
import { MeResponse, MyContext } from "../../types";
import { Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserBaseServices } from "./";

@Resolver()
export class Me extends UserBaseServices {
  @Query(() => MeResponse, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<MeResponse> {
    const { cart, user } = req;
    return { user, cart };
  }

  @Mutation(() => Boolean)
  @CurrentUser()
  async LogOut(@Ctx() { req }: MyContext) {
    await deleteSession(req.session);
    return true;
  }
}
