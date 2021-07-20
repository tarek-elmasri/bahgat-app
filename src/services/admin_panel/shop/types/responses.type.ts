import { InvalidUuidSyntaxError, OnError } from "../../../../errors";
import { Field, ObjectType } from "type-graphql";
import { Category, Item } from "../../../../entity";

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
  id?: string[];

  constructor(code?: string, message?: string, id?: string[]) {
    super(code, message);
    this.id = id;
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
export class DeleteResponse {
  @Field(() => String, { nullable: true })
  payload?: "Success";

  @Field(() => OnError, { nullable: true })
  errors?: OnError;
}

@ObjectType()
export class NewItemError implements OnError {
  @Field()
  code: string;

  @Field()
  message: string;

  @Field(() => [String], { nullable: true })
  categoryId?: string[];

  @Field(() => [String], { nullable: true })
  name?: string[];

  @Field(() => [String], { nullable: true })
  price?: string[];

  @Field(() => [String], { nullable: true })
  stock?: string[];

  constructor(
    code: string = "INVALID_INPUT_PARAMETER",
    message: string = "Invalid Input Parameters",
    categoryId?: string[]
  ) {
    this.code = code;
    this.message = message;
    this.categoryId = categoryId;
  }
}

@ObjectType()
export class UpdateItemErrors
  extends NewItemError
  implements InvalidUuidSyntaxError
{
  @Field(() => [String], { nullable: true })
  id?: string[];

  constructor(
    code?: string,
    message?: string,
    id?: string[],
    categoryId?: string[]
  ) {
    super(code, message);
    this.id = id;
    this.categoryId = categoryId;
  }
}

@ObjectType()
export class CreateItemResponse {
  @Field(() => Item, { nullable: true })
  payload?: Item;

  @Field(() => NewItemError, { nullable: true })
  errors?: NewItemError;
}

@ObjectType()
export class UpdateItemResponse {
  @Field(() => Item, { nullable: true })
  payload?: Item;

  @Field(() => UpdateItemErrors, { nullable: true })
  errors?: UpdateItemErrors;
}
