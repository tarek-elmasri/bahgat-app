import { Cart, User } from "../entity";
import { Field, ObjectType } from "type-graphql";
import { OnError } from "../errors";
import { normalizeEmail } from "../utils";

@ObjectType()
export class MeResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Cart)
  cart: Cart;
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

  static async validateUniqness(input: { email: string; phoneNo: number }) {
    const result = new CreateRegisterationErrors("DUPLICATE");

    const userExists = await User.findOne({
      where: { email: normalizeEmail(input.email) },
    });

    if (userExists) result.email = ["Email already exists."];

    const phoneExists = await User.findOne({
      where: { phoneNo: input.phoneNo },
    });
    if (phoneExists) result.phoneNo = ["PhoneNo. already exists."];

    return userExists || phoneExists ? result : undefined;
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

// @ObjectType()
// export class UpdateMeSuccess {
//   @Field(() => User)
//   user: User;

//   constructor(user: User) {
//     this.user = user;
//   }
// }

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

  @Field(() => [String], { nullable: true })
  phoneNo?: string[];
}

@ObjectType()
export class CreateLoginResponse {
  @Field(() => String, { nullable: true })
  payload?: string;

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
  @Field(() => String, { nullable: true })
  payload?: string;

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
