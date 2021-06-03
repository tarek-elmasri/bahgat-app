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
  @Field(() => String)
  uuid: string;

  @Field(() => UpdateUserProperties)
  fields: UpdateUserProperties;
}
