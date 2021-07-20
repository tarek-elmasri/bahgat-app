import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { UserBaseServices } from "./userBaseServices";
import { User } from "../../entity";
import { MYSession } from "../../middlewares";
import { MyContext } from "../../types";
import {
  CreateResetPasswordInput,
  ResetPasswordInput,
} from "./types/inputs.type";
import {
  createResetPasswordSchema,
  resetPasswordSchema,
} from "../../utils/validators";
import {
  CreateResetPasswordErrors,
  CreateResetPasswordResponse,
  ResetPasswordErrors,
  ResetPasswordResponse,
} from "./types/responses.types";
import { CurrentUser } from "../../middlewares/authorizations";

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

    if (otpResponse.errors)
      return {
        errors: otpResponse.errors,
      };

    return {
      payload: otpResponse.payload,
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

    const otpErrors = await userAttempt.getOtpRequestErrors(user!.phoneNo);
    if (otpErrors) return { errors: otpErrors };

    await user!.resetPassword(input.newPassword);
    // update session for the new refreshToken
    await MYSession.updateSession(session, user!, req, res);

    return {
      payload: {
        code: "Success",
        message: "Password has successfully updated",
      },
    };
  }
}
