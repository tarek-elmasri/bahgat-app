import { Field, InputType, Int } from "type-graphql";
import { Role } from "./Role";

@InputType()
export class CreateRegistrationInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  phoneNo: number;
}

@InputType()
export class RegisterInput extends CreateRegistrationInput {
  @Field(() => Int)
  OTP: number;
}

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field()
  phoneNo: number;
}

@InputType()
class AuthorizationInput {
  @Field(() => Boolean, { defaultValue: false })
  viewAllUsers: boolean;

  @Field(() => Boolean, { defaultValue: false })
  updateUser: boolean;

  @Field(() => Boolean, { defaultValue: false })
  deleteUser: boolean;

  @Field(() => Boolean, { defaultValue: false })
  addItem: boolean;

  @Field(() => Boolean, { defaultValue: false })
  updateItem: boolean;

  @Field(() => Boolean, { defaultValue: false })
  deleteItem: boolean;

  @Field(() => Boolean, { defaultValue: false })
  addCategory: boolean;

  @Field(() => Boolean, { defaultValue: false })
  updateCategory: boolean;

  @Field(() => Boolean, { defaultValue: false })
  deleteCategory: boolean;
}

@InputType()
class PanelUpdateUserProperties {
  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => Role, { nullable: true })
  role?: Role;
}

@InputType()
export class PanelUpdateUserInput {
  @Field(() => String)
  id: string;

  @Field(() => PanelUpdateUserProperties)
  fields: PanelUpdateUserProperties;

  @Field(() => AuthorizationInput, { nullable: true })
  authorization?: AuthorizationInput;
}

@InputType()
export class CreateLoginInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  phoneNo: number;
}
@InputType()
export class LoginInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field()
  phoneNo: number;

  @Field(() => Int)
  OTP: number;
}
