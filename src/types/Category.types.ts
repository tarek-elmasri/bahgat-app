import { Category } from "../entity";
import { InvalidUuidSyntaxError, OnError } from "../errors";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class CreateCategoryErrors implements OnError {
  @Field()
  code: string = "INVALID_INPUT_PARAMETERS";

  @Field()
  message: string = "Invalid Input Parameters.";

  @Field(() => [String], { nullable: true })
  name?: string[];

  @Field(() => [String], { nullable: true })
  description?: string[];
}

@ObjectType()
export class UpdateCategoryErrors extends InvalidUuidSyntaxError {
  @Field(() => [String], { nullable: true })
  name?: string[];

  @Field(() => [String], { nullable: true })
  description?: string[];

  constructor(
    code: string = "INVALID_INPUT-PARAMETERS",
    message: string = "Invalid Input parameters",
    uuid?: string[]
  ) {
    super(code, message, uuid);
    this.code = code;
    this.message = message;
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

@ObjectType()
export class CategoryResponse {
  @Field(() => Category, { nullable: true })
  payload?: Category;

  @Field(() => OnError, { nullable: true })
  errors?: OnError;
}
