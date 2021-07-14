import { PhoneVerification, User } from "../entity";
import { normalizeEmail, syncCart, updateEntity } from "../utils";
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
  loginSchema,
  registerSchema,
  updateMeSchema,
} from "../utils/validators";

/*
queries:
    me

mutations:
    login
    register
    updateMe
    resetPassword
*/

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
    const userAttempt = User.create(input).normalizeEmail();
    await userAttempt.validateInput(createLoginSchema);
    const formErrors = userAttempt.getErrors(OnError);
    if (formErrors) return { errors: formErrors };

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
    const userAttempt = User.create(credentials).setOTP(credentials.OTP);
    const formErrors = (await userAttempt.validateInput(loginSchema)).getErrors(
      OnError
    );

    if (formErrors) {
      formErrors.code = "INVALID_CREDENTIALS";
      formErrors.message = "Invalid Email or Password";
      return { errors: formErrors };
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
    const userAttempt = User.create(input).normalizeEmail();
    await userAttempt.validateInput(createRegistrationSchema);
    await userAttempt.validateUniqueness();
    const formErrors = userAttempt.getErrors(CreateRegisterationErrors);
    if (formErrors) return { errors: formErrors };

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
    return { payload: "OTP is successfully sent to phone no." };
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
    const formErrors = user.getErrors(RegisterErrors);
    if (formErrors) return { errors: formErrors };

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
    const formErrors = (
      await (
        await User.create(input).validateInput(updateMeSchema)
      ).validateUniqueness({ user: user! })
    ).getErrors(UpdateMeErrors);

    if (formErrors) return { errors: formErrors };

    //update user
    const updatedUser = await updateEntity(
      User,
      { id: user!.id },
      {
        ...input,
        email: normalizeEmail(input.email),
      }
    );

    return { payload: updatedUser! };
  }

  @Mutation(() => Boolean)
  async LogOut(@Ctx() { req }: MyContext) {
    await deleteSession(req.session);
    return true;
  }
}
// @Mutation()
// async resetPassword(
//   @Arg("input") input: {oldPassword: string , newPassword:string}
//   @Ctx() {req}:MyContext
// ): Promise<PayloadResponse>{

//   try {
//     const formErrors = await myValidator(input , {newPassword: "required|minLength:4"})
//     if (formErrors) return {errors: formErrors}

//     if (!req.user) throw new Err(ErrCode.NOT_AUTHORIZED, "UnAuthorized action")
//     const matched = compare(input.oldPassword , req.user.password)

//     if (!matched) throw new Err(ErrCode.NOT_FOUND, "Invalid password for this user")

//   } catch (err) {

//   }

// }
