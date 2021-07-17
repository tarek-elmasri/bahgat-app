import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { PhoneVerification, User } from "../../entity";
import { isGuest, updateSession } from "../../middlewares";
import {
  CreateRegisterationErrors,
  CreateRegisterationResponse,
  CreateRegistrationInput,
  LoginSuccess,
  MyContext,
  RegisterErrors,
  RegisterInput,
  RegisterResponse,
} from "../../types";
import {
  createRegistrationSchema,
  registerSchema,
} from "../../utils/validators";
import { UserBaseServices } from "./userBaseServices";

@Resolver()
export class RegisterationServices extends UserBaseServices {
  @Mutation(() => CreateRegisterationResponse)
  @isGuest()
  async createRegistration(
    @Arg("input") input: CreateRegistrationInput
  ): Promise<CreateRegisterationResponse> {
    // input validations
    const userAttempt = await (
      await User.create(input)
        .normalizeEmail()
        .validateInput(createRegistrationSchema)
    ).validateUniqueness();

    const errors = userAttempt.getErrors(CreateRegisterationErrors);
    if (errors) return { errors };

    const otpResponse = await this.otpRequest(userAttempt.phoneNo);

    if (otpResponse.errors) return { errors: otpResponse.errors };

    return { payload: otpResponse.payload };
  }

  @Mutation(() => RegisterResponse)
  @isGuest()
  async register(
    @Arg("input") input: RegisterInput,
    @Ctx() { req, res }: MyContext
  ): Promise<RegisterResponse> {
    // validaate input fields
    const user = User.create(input).normalizeEmail().setOTP(input.OTP);
    await user.validateInput(registerSchema);
    await user.validateUniqueness();
    const errors = user.getErrors(RegisterErrors);
    if (errors) return { errors };

    // find the phone verification for otp
    const verifiedPhone = await PhoneVerification.findOne({
      where: { phoneNo: input.phoneNo },
    });
    if (!verifiedPhone)
      return {
        errors: new RegisterErrors("PHONE_NOT_VERIFIED", undefined, [
          "Phone not verified, Call createRegisteration first.",
        ]),
      };

    // isValidOtp validates OTP match and not expired
    if (!verifiedPhone.isValidOTP(input.OTP))
      return {
        errors: new RegisterErrors(
          "INVALID_OTP",
          undefined,
          undefined,
          undefined,
          undefined,
          ["Invalid or expired OTP."]
        ),
      };

    // hash password and save.
    await user.register();
    // update current session cart userId field from null to the new registered user
    const { session, cart } = req;
    cart.userId = user.id; //linking the current cart in session with the new user
    await cart.save();
    //updating session data to have the new userId and refresh token
    await updateSession(session, user, req, res);

    return { payload: new LoginSuccess(user, cart) };
  }
}
