import { Arg, Mutation, Resolver } from "type-graphql";
import { UserBaseServices } from "./userBaseServices";
import { User } from "../../entity";
import {
  createForgetPasswordSchema,
  forgetPasswordSchema,
} from "../../utils/validators";
import {
  CreateForgetPasswordErrors,
  CreateForgetPasswordResponse,
  ForgetPasswordErrors,
  ForgetPasswordResponse,
} from "./types/responses.types";
import {
  CreateForgetPasswordInput,
  ForgetPasswordInput,
} from "./types/inputs.type";
import { isGuest } from "../../middlewares/authorizations";

@Resolver()
export class ForgetPassword extends UserBaseServices {
  @Mutation(() => CreateForgetPasswordResponse)
  @isGuest()
  async createForgetPassword(
    @Arg("input") { newPassword, phoneNo }: CreateForgetPasswordInput
  ): Promise<CreateForgetPasswordResponse> {
    const userAttempt = User.create({ phoneNo }).setNewPassword(newPassword);
    await userAttempt.validateInput(createForgetPasswordSchema);
    const errors = userAttempt.getErrors(CreateForgetPasswordErrors);
    if (errors) return { errors };

    const user = await User.findOne({ where: { phoneNo } });
    if (!user)
      return {
        errors: {
          code: "NOT_FOUND",
          message: "No user found for this phoneNo.",
          phoneNo: ["No user found for this phoneNo."],
        },
      };

    const otpResponse = await user.sendOTP();
    if (otpResponse.errors) return { errors: otpResponse.errors };

    return { payload: otpResponse.payload };
  }

  @Mutation(() => ForgetPasswordResponse)
  @isGuest()
  async forgetPassword(
    @Arg("input") { newPassword, phoneNo, OTP }: ForgetPasswordInput
  ): Promise<ForgetPasswordResponse> {
    const userAttempt = User.create({ phoneNo })
      .setOTP(OTP)
      .setNewPassword(newPassword);
    await userAttempt.validateInput(forgetPasswordSchema);
    const errors = userAttempt.getErrors(ForgetPasswordErrors);
    if (errors) return { errors };

    const user = await User.findOne({ where: { phoneNo } });
    if (!user)
      return {
        errors: {
          code: "NOT_FOUND",
          message: "No user matches this PhoneNo.",
          phoneNo: ["No user matches this phoneNo."],
        },
      };

    const otpErrors = await userAttempt.getOtpRequestErrors();

    if (otpErrors) return { errors: otpErrors };

    await user.resetPassword(newPassword);

    return {
      payload: {
        code: "Success",
        message: "Password updated successfully.",
      },
    };
  }
}
