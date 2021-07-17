import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { isGuest, updateSession } from "../../middlewares";
import { UserBaseServices } from "./userBaseServices";
import { User } from "../../entity";
import { OnError } from "../../errors";
import { createLoginSchema, loginSchema } from "../../utils/validators";
import { syncCart } from "../../utils";
import {
  CreateLoginInput,
  CreateLoginResponse,
  LoginInput,
  LoginResponse,
  LoginSuccess,
  MyContext,
} from "../../types";

@Resolver()
export class UserAuthentication extends UserBaseServices {
  @Mutation(() => CreateLoginResponse)
  @isGuest()
  async createLogin(
    @Arg("input") input: CreateLoginInput
  ): Promise<CreateLoginResponse> {
    const userAttempt = await User.create(input)
      .normalizeEmail()
      .validateInput(createLoginSchema);

    if (userAttempt.getErrors()) return { errors: userAttempt.getErrors() };

    const user = await userAttempt.auth();
    if (!user)
      return {
        errors: new OnError("INVALID_CREDENTIALS", "Invalid Email or Password"),
      };

    const otpResponse = await user.sendOTP();
    if (otpResponse.code !== "1")
      return { errors: new OnError(otpResponse.code, otpResponse.message) };

    return { payload: otpResponse.message };
  }

  @Mutation(() => LoginResponse)
  @isGuest()
  async login(
    @Arg("input") credentials: LoginInput,
    @Ctx() { req, res }: MyContext
  ): Promise<LoginResponse> {
    //validate input
    const userAttempt = await User.create(credentials)
      .setOTP(credentials.OTP)
      .validateInput(loginSchema);

    const errors = userAttempt.getErrors(OnError);

    if (errors) {
      errors.code = "INVALID_CREDENTIALS";
      errors.message = "Invalid Email or Password";
      return { errors };
    }

    //Authentication
    const user = await userAttempt.auth({ validateOTP: true });
    if (!user)
      return {
        errors: new OnError(
          "INVALID_CREDENTIALS",
          "Invalid credentials or OTP."
        ),
      };

    // syncing guest cart with user cart after successful login
    // note that function returns the old cart before updating
    // to avoid new query to database
    // as the only needed field is the if field of the cart to update
    // the session and cookies
    const { session } = req;
    const cart = await syncCart(user, session);
    //updating user session and cookies
    session.cartId = cart.id;
    await updateSession(session, user, req, res);

    return { payload: new LoginSuccess(user, cart) };
  }
}
