import { Cart, User } from "../../../entity";
import { Field, ObjectType } from "type-graphql";
import { OnError } from "../../../errors";

@ObjectType()
export class MeResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Cart)
  cart: Cart;
}

@ObjectType()
export class OTP_Response {
  @Field()
  code: string;
  @Field()
  message: string;

  constructor(
    code: string = "OTP_Response",
    message: string = "OTP response message"
  ) {
    this.code = code;
    this.message = message;
  }
}

export interface OTP_Status {
  payload?: OTP_Response;
  errors?: { code: string; message: string };
}

@ObjectType()
export class LoginSuccess {
  @Field(() => User)
  user: User;

  @Field(() => Cart)
  cart: Cart;

  constructor(user: User, cart: Cart) {
    this.user = user;
    this.cart = cart;
  }
}

@ObjectType()
export class CreateRegisterationErrors implements OnError {
  @Field()
  code: string = "INVALID_INPUT_PARAMETERS";

  @Field()
  message: string = "invalid input parameters";

  @Field(() => [String], { nullable: true })
  username?: string[];

  @Field(() => [String], { nullable: true })
  email?: string[];

  @Field(() => [String], { nullable: true })
  phoneNo?: string[];

  @Field(() => [String], { nullable: true })
  password?: string[];

  constructor(
    code: string = "INVALID_INPUT_PARAMETERS",
    message: string = "Invaliid input parameters",
    email?: string[],
    phoneNo?: string[],
    username?: string[],
    password?: string[]
  ) {
    this.code = code;
    this.message = message;
    (this.username = username), (this.email = email);
    this.password = password;
    this.phoneNo = phoneNo;
  }
}

@ObjectType()
export class RegisterErrors extends CreateRegisterationErrors {
  @Field(() => [String], { nullable: true })
  OTP?: string[];

  constructor(
    code: string = "INVALID_INPUT_PARAMETERS",
    email?: string[],
    phoneNo?: string[],
    username?: string[],
    password?: string[],
    OTP?: string[]
  ) {
    super(code, undefined, email, phoneNo, username, password);
    this.OTP = OTP;
  }
}

@ObjectType()
export class UpdateMeErrors implements OnError {
  @Field()
  code: string = "INVALID_INPUT_PARAMETERS";

  @Field()
  message: string = "invalid input parameters";

  @Field(() => [String], { nullable: true })
  email?: string[];

  @Field(() => [String], { nullable: true })
  username?: string[];

  // @Field(() => [String], { nullable: true })
  // phoneNo?: string[];
}

@ObjectType()
export class CreateLoginResponse {
  @Field(() => OTP_Response, { nullable: true })
  payload?: OTP_Response;

  @Field(() => OnError, { nullable: true })
  errors?: OnError;
}

@ObjectType()
export class LoginResponse {
  @Field(() => LoginSuccess, { nullable: true })
  payload?: LoginSuccess;

  @Field(() => OnError, { nullable: true })
  errors?: OnError;
}

@ObjectType()
export class RegisterResponse {
  @Field(() => LoginSuccess, { nullable: true })
  payload?: LoginSuccess;

  @Field(() => RegisterErrors, { nullable: true })
  errors?: RegisterErrors;
}

@ObjectType()
export class CreateRegisterationResponse {
  @Field(() => OTP_Response, { nullable: true })
  payload?: OTP_Response;

  @Field(() => CreateRegisterationErrors, { nullable: true })
  errors?: CreateRegisterationErrors;
}

@ObjectType()
export class UpdateMeResponse {
  @Field(() => User, { nullable: true })
  payload?: User;

  @Field(() => UpdateMeErrors, { nullable: true })
  errors?: UpdateMeErrors;
}

@ObjectType()
export class CreateResetPasswordErrors implements OnError {
  @Field()
  code: string;

  @Field()
  message: string;

  @Field(() => [String], { nullable: true })
  password?: string[];

  @Field(() => [String], { nullable: true })
  newPassword?: string[];

  constructor(
    code: string = "INVALID_INPUT_PARAMETERS",
    message: string = "Invalid input parameters",
    password?: string[],
    newPassword?: string[]
  ) {
    this.code = code;
    this.message = message;
    this.password = password;
    this.newPassword = newPassword;
  }
}
@ObjectType()
export class ResetPasswordErrors extends CreateResetPasswordErrors {
  @Field(() => [String], { nullable: true })
  OTP?: string[];

  constructor(
    code?: string,
    message?: string,
    password?: string[],
    newPassword?: string[],
    OTP?: string[]
  ) {
    super(code, message, password, newPassword);
    this.OTP = OTP;
  }
}

@ObjectType()
export class ResetPasswordResponse {
  @Field(() => OTP_Response, { nullable: true })
  payload?: OTP_Response;

  @Field(() => ResetPasswordErrors, { nullable: true })
  errors?: ResetPasswordErrors;
}

@ObjectType()
export class CreateResetPasswordResponse {
  @Field(() => OTP_Response, { nullable: true })
  payload?: OTP_Response;

  @Field(() => CreateResetPasswordErrors, { nullable: true })
  errors?: CreateResetPasswordErrors;
}

@ObjectType()
export class CreateUpdatePhoneNoErrors implements OnError {
  @Field()
  code: string;
  @Field()
  message: string;

  @Field(() => [String], { nullable: true })
  phoneNo?: string[];

  constructor(
    code: string = "INVALID_INPUT-PARAMETERS",
    message: string = "Invalid Input Parameters",
    phoneNo?: string[]
  ) {
    this.code = code;
    this.message = message;
    this.phoneNo = phoneNo;
  }
}

@ObjectType()
export class UpdatePhoneNoErrors extends CreateUpdatePhoneNoErrors {
  @Field(() => [String], { nullable: true })
  OTP?: string[];

  constructor(
    code?: string,
    message?: string,
    phoneNo?: string[],
    OTP?: string[]
  ) {
    super(code, message, phoneNo);
    this.OTP = OTP;
  }
}

@ObjectType()
export class CreateUpdatePhoneNoResponse {
  @Field(() => OTP_Response, { nullable: true })
  payload?: OTP_Response;

  @Field(() => CreateUpdatePhoneNoErrors, { nullable: true })
  errors?: CreateUpdatePhoneNoErrors;
}

@ObjectType()
export class UpdatePhoneNoResponse extends CreateUpdatePhoneNoResponse {
  @Field(() => UpdatePhoneNoErrors, { nullable: true })
  errors?: UpdatePhoneNoErrors;
}

@ObjectType()
export class CreateForgetPasswordErrors implements OnError {
  @Field()
  code: string;
  @Field()
  message: string;
  @Field(() => [String], { nullable: true })
  newPassword?: string[];
  @Field(() => [String], { nullable: true })
  phoneNo?: string[];

  constructor(
    code: string = "INVALID_INPUT_PARAMETERS",
    message: string = "Invalid Input Parameters",
    newPassword?: string[],
    phoneNo?: string[]
  ) {
    this.code = code;
    this.message = message;
    this.phoneNo = phoneNo;
    this.newPassword = newPassword;
  }
}

@ObjectType()
export class ForgetPasswordErrors extends CreateForgetPasswordErrors {
  @Field(() => [String], { nullable: true })
  OTP?: string[];
  constructor(
    code?: string,
    message?: string,
    phoneNo?: string[],
    newPassword?: string[],
    OTP?: string[]
  ) {
    super(code, message, newPassword, phoneNo);
    this.OTP = OTP;
  }
}

@ObjectType()
export class CreateForgetPasswordResponse {
  @Field(() => OTP_Response, { nullable: true })
  payload?: OTP_Response;
  @Field(() => CreateForgetPasswordErrors, { nullable: true })
  errors?: CreateForgetPasswordErrors;
}

@ObjectType()
export class ForgetPasswordResponse extends CreateForgetPasswordResponse {
  @Field(() => ForgetPasswordErrors, { nullable: true })
  errors?: ForgetPasswordErrors;
}
