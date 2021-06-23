import { Field, InputType } from "type-graphql";

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
class UpdateUserProperties {
  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  password: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => UpdateUserProperties)
  fields: UpdateUserProperties;
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

  @Field(() => String, { nullable: true })
  role?: "USER" | "Admin" | "STAFF";
}

@InputType()
export class PanelUpdateUserInput {
  @Field(() => String)
  uuid: string;

  @Field(() => PanelUpdateUserProperties)
  fields: PanelUpdateUserProperties;

  @Field(() => AuthorizationInput, { nullable: true })
  authorization?: AuthorizationInput;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
