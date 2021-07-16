import { PhoneVerification, User } from "../entity";
import { syncCart } from "../utils";
import { OnError } from "../errors";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import {
  RegisterInput,
  UpdateUserInput,
  MyContext,
  LoginInput,
  LoginResponse,
  MeResponse,
  RegisterResponse,
  LoginSuccess,
  RegisterErrors,
  UpdateMeResponse,
  CreateRegistrationInput,
  CreateRegisterationErrors,
  CreateRegisterationResponse,
  UpdateMeErrors,
  CreateLoginResponse,
  CreateLoginInput,
  CreateResetPasswordInput,
  CreateResetPasswordResponse,
  CreateResetPasswordErrors,
  ResetPasswordErrors,
  ResetPasswordResponse,
  ResetPasswordInput,
  OTP_Response,
} from "../types";
import {
  updateSession,
  isGuest,
  deleteSession,
  isAuthenticated,
} from "../middlewares";
import {
  createLoginSchema,
  createRegistrationSchema,
  createResetPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateMeSchema,
} from "../utils/validators";
import { getConnection } from "typeorm";

@Resolver()
export class UserResolver {
  @Query(() => MeResponse, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<MeResponse> {
    const { cart, user } = req;
    return { user, cart };
  }

  @Mutation(() => CreateLoginResponse)
  @UseMiddleware(isGuest)
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
  @UseMiddleware(isGuest)
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

  @Mutation(() => CreateRegisterationResponse)
  //@UseMiddleware(isGuest)
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

    // check if previus requests wea sent.
    let phoneVerification = await PhoneVerification.findOne({
      where: { phoneNo: input.phoneNo },
    });
    // excluding resend OTP if short intervals between requests.
    if (phoneVerification && phoneVerification.isShortRequest())
      return {
        errors: new CreateRegisterationErrors(
          "SHORT_TIME_REQUEST",
          "Interval between OTP requests must exceed 20 secsonds."
        ),
      };

    // create phoneVerification for new requests
    if (!phoneVerification) {
      phoneVerification = PhoneVerification.create({
        phoneNo: input.phoneNo,
      });
    }
    //generating OTP and save or resave model
    await phoneVerification.generateOTP().save();
    // sending otp
    const otpResponse = await phoneVerification.sendOTP();
    if (otpResponse.code !== "1")
      return {
        errors: new CreateRegisterationErrors(
          otpResponse.code,
          otpResponse.message
        ),
      };
    return {
      payload: {
        message: "OTP is successfully sent to phone no.",
        code: "Success",
      },
    };
  }

  @Mutation(() => RegisterResponse)
  @UseMiddleware(isGuest)
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

  @Mutation(() => UpdateMeResponse)
  @UseMiddleware(isAuthenticated)
  async updateMe(
    @Arg("input", () => UpdateUserInput) input: UpdateUserInput,
    @Ctx() { req }: MyContext
  ): Promise<UpdateMeResponse> {
    // current user ?
    const { user } = req;
    //if (!user) throw new UnAuthorizedError("Not Logged IN");

    //validating the form
    const errors = (
      await (
        await User.create(input).normalizeEmail().validateInput(updateMeSchema)
      ).validateUniqueness({ user: user! })
    ).getErrors(UpdateMeErrors);

    if (errors) return { errors };

    //update user
    await getConnection().getRepository(User).update({ id: user!.id }, input);
    await user!.reload();

    return { payload: user };
  }

  @Mutation(() => Boolean)
  async LogOut(@Ctx() { req }: MyContext) {
    await deleteSession(req.session);
    return true;
  }

  @Mutation(() => CreateResetPasswordResponse)
  //@UseMiddleware(isAuthenticated)
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
  //@UseMiddleware(isAuthenticated)
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
