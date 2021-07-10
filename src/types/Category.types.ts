import { Category } from "../entity";
import { InvalidUuidSyntaxError, OnError } from "../errors";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class CreateCategoryErrors implements OnError {
  @Field()
  code: string;

  @Field()
  message: string;

  @Field(() => [String], { nullable: true })
  name?: string[];

  @Field(() => [String], { nullable: true })
  description?: string[];

  constructor(
    code: string = "INVALID_INPUT_PARAMETERS",
    message: string = "Invalid Input Parameters."
  ) {
    this.code = code;
    this.message = message;
  }
}

@ObjectType()
export class UpdateCategoryErrors
  extends CreateCategoryErrors
  implements InvalidUuidSyntaxError
{
  @Field(() => [String], { nullable: true })
  uuid?: string[];

  constructor(code?: string, message?: string, uuid?: string[]) {
    super(code, message);
    this.uuid = uuid;
  }
}

@ObjectType()
export class UpdateCategoryResponse {
  @Field(() => Category, { nullable: true })
  payload?: Category;

  @Field(() => UpdateCategoryErrors, { nullable: true })
  errors?: UpdateCategoryErrors;
}

@ObjectType()
export class CreateCategoryResponse {
  @Field(() => Category, { nullable: true })
  payload?: Category;

  @Field(() => CreateCategoryErrors, { nullable: true })
  errors?: CreateCategoryErrors;
}
