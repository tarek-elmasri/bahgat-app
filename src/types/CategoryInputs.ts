import { Field, InputType } from "type-graphql";

@InputType()
export class NewCategoryInput {
  @Field()
  name: string;

  @Field()
  description: string;
}

@InputType()
class updateCategoryFields {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;
}

@InputType()
export class UpdateCategoryInput {
  @Field(() => String)
  id: string;

  @Field(() => updateCategoryFields)
  fields: updateCategoryFields;
}

@InputType()
export class DeleteCategoryInput {
  @Field()
  id: string;

  @Field(() => Boolean, { defaultValue: true })
  saveDelete: boolean;
}
