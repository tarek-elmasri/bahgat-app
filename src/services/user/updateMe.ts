import { User } from "../../entity";
import { MyContext } from "../../types";
import { updateMeSchema } from "../../utils/validators";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { UserBaseServices } from "./userBaseServices";
import { UpdateMeErrors, UpdateMeResponse } from "./types/responses.types";
import { UpdateMeInput } from "./types/inputs.type";
import { CurrentUser } from "../../middlewares/authorizations";

@Resolver()
export class UpdateMe extends UserBaseServices {
  @Mutation(() => UpdateMeResponse)
  @CurrentUser()
  async updateMe(
    @Arg("input") input: UpdateMeInput,
    @Ctx() { req }: MyContext
  ): Promise<UpdateMeResponse> {
    const { user } = req;

    //validating the form
    const errors = (
      await (
        await User.create(input).normalizeEmail().validateInput(updateMeSchema)
      ).validateUniqueEmail({ user: user! })
    ).getErrors(UpdateMeErrors);

    if (errors) return { errors };

    //update user
    await getConnection().getRepository(User).update({ id: user!.id }, input);
    await user!.reload();

    return { payload: user };
  }
}
