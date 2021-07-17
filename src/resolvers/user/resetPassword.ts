import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { UserBaseServices } from "./userBaseServices";
import { PhoneVerification, User } from "../../entity";
import { CurrentUser, updateSession } from "../../middlewares";
import {
  CreateResetPasswordErrors,
  CreateResetPasswordInput,
  CreateResetPasswordResponse,
  MyContext,
  OTP_Response,
  ResetPasswordErrors,
  ResetPasswordInput,
  ResetPasswordResponse,
} from "../../types";
import {
  createResetPasswordSchema,
  resetPasswordSchema,
} from "../../utils/validators";

@Resolver()
export class ResetPassword extends UserBaseServices {
  @Mutation(() => CreateResetPasswordResponse)
  @CurrentUser()
  async createResetPassword(
    @Arg("input") input: CreateResetPasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<CreateResetPasswordResponse> {
    const { user } = req;
    const userAttempt = User.create({
      password: input.oldPassword,
    }).setNewPassword(input.newPassword);
    await userAttempt.validateInput(createResetPasswordSchema);

    const errors = userAttempt.getErrors(CreateResetPasswordErrors);
    if (errors) return { errors };

    if (!(await userAttempt.isPasswordMatch(user!.password)))
      return {
        errors: new CreateResetPasswordErrors(
          "INVALID_CREDENTIALS",
          "Invalid credentials",
          ["Invalid user Password."]
        ),
      };

    const otpResponse = await user!.sendOTP();

    if (otpResponse.code !== "1")
      return {
        errors: otpResponse,
      };

    return {
      payload: new OTP_Response(
        "Success",
        "OTP sent successfully to user phoneNo."
      ),
    };
  }

  @Mutation(() => ResetPasswordResponse)
  @CurrentUser()
  async resetPassword(
    @Arg("input") input: ResetPasswordInput,
    @Ctx() { req, res }: MyContext
  ): Promise<ResetPasswordResponse> {
    const { user, session } = req;
    const userAttempt = User.create({ password: input.oldPassword })
      .setOTP(input.OTP)
      .setNewPassword(input.newPassword);
    await userAttempt.validateInput(resetPasswordSchema);
    const errors = userAttempt.getErrors(ResetPasswordErrors);
    if (errors) return { errors };

    if (!(await userAttempt.isPasswordMatch(user!.password)))
      return {
        errors: new ResetPasswordErrors(
          "INVALID_CREDENTIALS",
          "Invalid credentials",
          ["Invalid user Password."]
        ),
      };

    // find the phone verification for otp
    const verifiedPhone = await PhoneVerification.findOne({
      where: { phoneNo: user!.phoneNo },
    });

    // isValidOtp validates OTP match and not expired
    if (!verifiedPhone!.isValidOTP(input.OTP))
      return {
        errors: new ResetPasswordErrors(
          "INVALID_OTP",
          "Invalid OTP Match.",
          undefined,
          undefined,
          ["Invalid or expired OTP."]
        ),
      };

    user!.password = input.newPassword;
    // update refresh token to push any other devices logged with old password
    user!.setRefreshToken();
    // hash passwords and saves
    await user!.register();
    // update session for the new refreshToken
    await updateSession(session, user!, req, res);

    return {
      payload: {
        code: "Success",
        message: "Password has successfully updated",
      },
    };
  }
}
