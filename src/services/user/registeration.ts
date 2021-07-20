import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { UserBaseServices } from "./userBaseServices";
import { User } from "../../entity";
import { CreateRegistrationInput, RegisterInput } from "./types/inputs.type";
import { MyContext } from "../../types";
import {
  createRegistrationSchema,
  registerSchema,
} from "../../utils/validators";
import {
  CreateRegisterationErrors,
  CreateRegisterationResponse,
  LoginSuccess,
  RegisterErrors,
  RegisterResponse,
} from "./types/responses.types";
import { MYSession } from "../../middlewares";
import { isGuest } from "../../middlewares/authorizations";

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

    const otpResponse = await userAttempt.sendOTP();

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

    const otpErrors = await user.getOtpRequestErrors();
    if (otpErrors) return { errors: otpErrors };

    await user.register();
    // update current session cart userId field from null to the new registered user
    const { session, cart } = req;
    cart.userId = user.id; //linking the current cart in session with the new user
    await cart.save();
    //updating session data to have the new userId and refresh token
    await MYSession.updateSession(session, user, req, res);

    return { payload: new LoginSuccess(user, cart) };
  }
}
