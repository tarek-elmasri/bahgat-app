import { User } from "../../entity";
import { isGuest, updateSession } from "../../middlewares";
import {
  CreateForgetPasswordErrors,
  CreateForgetPasswordInput,
  CreateForgetPasswordResponse,
  ForgetPasswordErrors,
  ForgetPasswordInput,
  ForgetPasswordResponse,
  MyContext,
} from "../../types";
import {
  createForgetPasswordSchema,
  forgetPasswordSchema,
} from "../../utils/validators";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { UserBaseServices } from "./userBaseServices";

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
    if (otpResponse.code !== "1")
      return {
        errors: otpResponse,
      };

    return {
      payload: {
        code: "Success",
        message: "OTP sent successfully to user phoneNo.",
      },
    };
  }

  @Mutation(() => ForgetPasswordResponse)
  @isGuest()
  async forgetPassword(
    @Arg("input") { newPassword, phoneNo, OTP }: ForgetPasswordInput,
    @Ctx() { req, res }: MyContext
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

    const otpErrors = await this.getOtpRequestErrors(user.phoneNo, OTP);

    if (otpErrors)
      return {
        errors: {
          code: otpErrors.code,
          message: otpErrors.message,
          OTP: ["Expired or invalid OTP match."],
        },
      };

    user.password = newPassword;
    // update refresh token to push any other devices logged with old password
    user.setRefreshToken();
    // hash passwords and saves
    await user.register();
    // update session for the new refreshToken
    await updateSession(req.session, user, req, res);

    return {
      payload: {
        code: "Success",
        message: "Password updated successfully.",
      },
    };
  }
}
