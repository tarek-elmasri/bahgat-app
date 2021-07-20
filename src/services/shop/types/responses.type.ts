import { CartsItems } from "../../../entity";
import { Field, ObjectType } from "type-graphql";
import { OnError } from "../../../errors";

@ObjectType()
export class AddItemToCartErrors implements OnError {
  @Field()
  code: string;

  @Field()
  message: string;

  @Field(() => [String], { nullable: true })
  itemId?: string[];

  @Field(() => [String], { nullable: true })
  quantity?: string[];

  constructor(
    code: string = "INVALID_INPUT_PARAMETERS",
    message: string = "Invalid input parameters",
    itemId?: string[],
    quantity?: string[]
  ) {
    this.code = code;
    this.message = message;
    this.itemId = itemId;
    this.quantity = quantity;
  }
}

@ObjectType()
export class addItemToCartResponse {
  @Field(() => CartsItems, { nullable: true })
  payload?: CartsItems;

  @Field(() => AddItemToCartErrors, { nullable: true })
  errors?: AddItemToCartErrors;
}
