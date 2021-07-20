import { CurrentUser } from "../../middlewares/authorizations";
import { Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserBaseServices } from ".";
import { MYSession } from "../../middlewares";
import { MyContext } from "../../types";
import { MeResponse } from "./types/responses.types";

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
    await MYSession.deleteSession(req.session);
    return true;
  }
}
