import { InvalidUuidSyntaxError, OnError } from "../errors";
import { Field, ObjectType } from "type-graphql";
import { Item } from "../entity";

@ObjectType()
export class NewItemError implements OnError {
  @Field()
  code: string;

  @Field()
  message: string;

  @Field(() => [String], { nullable: true })
  categoryUuid?: string[];

  @Field(() => [String], { nullable: true })
  name?: string[];

  @Field(() => [String], { nullable: true })
  price?: string[];

  @Field(() => [String], { nullable: true })
  stock?: string[];

  constructor(
    code: string = "INVALID_INPUT_PARAMETER",
    message: string = "Invalid Input Parameters",
    categoryUuid?: string[]
  ) {
    this.code = code;
    this.message = message;
    this.categoryUuid = categoryUuid;
  }
}

@ObjectType()
export class UpdateItemErrors
  extends NewItemError
  implements InvalidUuidSyntaxError
{
  @Field(() => [String], { nullable: true })
  uuid?: string[];

  constructor(
    code?: string,
    message?: string,
    uuid?: string[],
    categoryUuid?: string[]
  ) {
    super(code, message);
    this.uuid = uuid;
    this.categoryUuid = categoryUuid;
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
