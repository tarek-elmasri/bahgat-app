import { Cart, User } from "../entity";
import { Field, ObjectType } from "type-graphql";
import { OnError } from "../errors";

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
export class RegisterErrors implements OnError {
  @Field()
  code: string = "INVALID_INPUT_PARAMETERS";

  @Field()
  message: string = "invalid input parameters";

  @Field(() => [String], { nullable: true })
  username?: string[];

  @Field(() => [String], { nullable: true })
  email?: string[];

  @Field(() => [String], { nullable: true })
  password?: string[];

  constructor(
    code: string = "INVALID_INPUT_PARAMETERS",
    email?: string[],
    username?: string[],
    password?: string[]
  ) {
    this.code = code;
    (this.username = username), (this.email = email);
    this.password = password;
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
export class UpdateMeResponse {
  @Field(() => User, { nullable: true })
  payload?: User;

  @Field(() => UpdateMeErrors, { nullable: true })
  errors?: UpdateMeErrors;
}
