import { Role } from "../../../../types";
import { Field, InputType } from "type-graphql";

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

// @InputType()
// class UpdateUserProperties {
//   @Field(() => String, { nullable: true })
//   username?: string;

//   @Field(() => String, { nullable: true })
//   email?: string;

//   @Field(() => Role, { nullable: true })
//   role?: Role;
// }

@InputType()
export class UpdateAuthorizationInput {
  @Field(() => String)
  id: string;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field(() => AuthorizationInput, { nullable: true })
  authorization?: AuthorizationInput;
}
