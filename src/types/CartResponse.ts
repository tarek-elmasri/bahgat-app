import { Cart } from "../entity/Cart";
import { Field, ObjectType } from "type-graphql";
import { MyError } from "./MyError";

@ObjectType()
export class CartResponse {
  @Field(() => Cart, { nullable: true })
  payload?: Cart;

  @Field(() => [MyError], { nullable: true })
  errors?: MyError[];
}
