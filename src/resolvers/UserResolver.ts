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
  //  InputError,
} from "../types";
import { User } from "../entity";
import {
  updateSession,
  isGuest,
  deleteSession,
  isAuthenticated,
} from "../middlewares";
import { normalizeEmail, syncCart, updateEntity } from "../utils";
import { Login, Register } from "../auth";
import {
  loginValidator,
  registerValidator,
  updateMeValidator,
} from "../utils/validators";
import { OnError } from "../errors";

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

  @Mutation(() => LoginResponse)
  @UseMiddleware(isGuest)
  async login(
    @Arg("input") credentials: LoginInput,
    @Ctx() { req, res }: MyContext
  ): Promise<LoginResponse> {
    //validate input
    const formErrors = await loginValidator(credentials);
    if (formErrors)
      return {
        errors: new OnError(
          "INVALID_CREDENTIALS",
          "Invalid Email or Password."
        ),
      };

    //Authentication
    const user = await Login(credentials);
    if (!user)
      return {
        errors: new OnError(
          "INVALID_CREDENTIALS",
          "Invalid Email or Password."
        ),
      };

    const { session } = req;
    // syncing guest cart with user cart after successful login
    // note that function returns the old cart before updating
    // to avoid new query to database
    // as the only needed field is the uuid field of the cart to update
    // the session and cookies
    const cart = await syncCart(user, session);

    //updating user session and cookies
    session.cartUuid = cart.uuid;
    await updateSession(session, user, req, res);

    return { payload: new LoginSuccess(user, cart) };
  }

  @Mutation(() => RegisterResponse)
  @UseMiddleware(isGuest)
  async register(
    @Arg("input") input: RegisterInput,
    @Ctx() { req, res }: MyContext
  ): Promise<RegisterResponse> {
    // validaate input fields
    const formErrors = await registerValidator(input);
    if (formErrors) return { errors: formErrors };

    // check if email already exists in db
    let user = await User.findOne({
      where: { email: normalizeEmail(input.email) },
    });
    if (user)
      return {
        errors: new RegisterErrors("EMAIL_ALREADY_EXISTS", [
          "Email already exists.",
        ]),
      };

    user = await Register(input); // create new user in database

    // update current session cart userId field from null to the new registered user
    const { session, cart } = req;
    cart.userUuid = user.uuid; //linking the current cart in session with the new user
    await cart.save();
    //updating session data to have the new userId and refresh token
    await updateSession(session, user, req, res);

    return { payload: new LoginSuccess(user, cart) };
  }

  @Mutation(() => UpdateMeResponse)
  @UseMiddleware(isAuthenticated)
  async updateMe(
    @Arg("fields", () => UpdateUserInput) fields: UpdateUserInput,
    @Ctx() { req }: MyContext
  ): Promise<UpdateMeResponse> {
    // current user ?
    const { user } = req;
    //if (!user) throw new UnAuthorizedError("Not Logged IN");

    //validating the form
    const formErrors = await updateMeValidator(fields);
    if (formErrors) return { errors: formErrors };

    //update user
    const updatedUser = await updateEntity(
      User,
      { uuid: user!.uuid },
      { email: normalizeEmail(fields.email), username: fields.username }
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
