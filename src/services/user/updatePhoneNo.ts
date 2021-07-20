import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { UserBaseServices } from "./userBaseServices";
import { User } from "../../entity";
import { MyContext } from "../../types";
import { UpdatePhoneNoInput } from "./types/inputs.type";
import {
  createUpdatePhoneNoSchema,
  updatePhoneNoSchema,
} from "../../utils/validators";
import {
  CreateUpdatePhoneNoErrors,
  CreateUpdatePhoneNoResponse,
  UpdatePhoneNoErrors,
  UpdatePhoneNoResponse,
} from "./types/responses.types";
import { CurrentUser } from "../../middlewares/authorizations";

@Resolver()
export class CreateUpdatePhoneNo extends UserBaseServices {
  @Mutation(() => CreateUpdatePhoneNoResponse)
  @CurrentUser()
  async createUpdatePhoneNo(
    @Arg("newPhoneNo") phoneNo: number,
    @Ctx() { req }: MyContext
  ): Promise<CreateUpdatePhoneNoResponse> {
    const user = await User.create({ phoneNo }).validateInput(
      createUpdatePhoneNoSchema
    );

    if (phoneNo.toString() === req.user!.phoneNo.toString())
      return {
        errors: {
          code: "SAME_VALUE",
          message: "PhoneNo matches current value",
        },
      };
    const errors = (
      await user.validateUniquePhoneNo({ user: req.user! })
    ).getErrors(CreateUpdatePhoneNoErrors);
    if (errors) return { errors };

    const response = await user.sendOTP();
    if (response.errors) return { errors: response.errors };

    return { payload: response.payload };
  }

  @Mutation(() => UpdatePhoneNoResponse)
  @CurrentUser()
  async updatePhoneNo(
    @Arg("input") { phoneNo, OTP }: UpdatePhoneNoInput,
    @Ctx() { req }: MyContext
  ): Promise<UpdatePhoneNoResponse> {
    const userAttempt = User.create({ phoneNo }).setOTP(OTP);
    await userAttempt.validateInput(updatePhoneNoSchema);

    if (phoneNo.toString() === req.user!.phoneNo.toString())
      return {
        errors: {
          code: "SAME_VALUE",
          message: "PhoneNo matches current value",
        },
      };

    await userAttempt.validateUniquePhoneNo({ user: req.user! });
    const errors = userAttempt.getErrors(UpdatePhoneNoErrors);
    if (errors) return { errors };

    const otpErrors = await userAttempt.getOtpRequestErrors();
    if (otpErrors) return { errors: otpErrors };

    req.user!.phoneNo = phoneNo;
    await req.user!.save();

    return {
      payload: {
        code: "Success",
        message: "User phoneNo updated successfully.",
      },
    };
  }
}
