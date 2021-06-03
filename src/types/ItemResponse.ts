import { Item } from "../entity";
import { Field, ObjectType } from "type-graphql";
import { MyError } from "./MyError";

@ObjectType()
export class ItemResponse {
  @Field(() => Item, { nullable: true })
  payload?: Item;

  @Field(() => [MyError], { nullable: true })
  errors?: MyError[];
}
