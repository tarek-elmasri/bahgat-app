import { Cart, Category, Item, User } from "../entity";
import { Field, ObjectType, createUnionType } from "type-graphql";
import { MyError } from "./MyError";

@ObjectType()
export class PayloadResponse {
  @Field(() => ResponseUnion, { nullable: true })
  payload?: Cart | Category | Item | User;

  @Field(() => [MyError], { nullable: true })
  errors?: MyError[];
}

const ResponseUnion = createUnionType({
  name: "response",
  types: () => [Cart, Category, Item, User] as const,
});
