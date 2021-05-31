import { Field, InputType } from "type-graphql";
import { Role } from "./Role";

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => String, { nullable: true, defaultValue: Role.USER })
  role: string;
}

@InputType()
class UpdateUserProperties {
  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => String, { nullable: true })
  role: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  uuid: string;

  @Field(() => UpdateUserProperties)
  properties: UpdateUserProperties;
}
