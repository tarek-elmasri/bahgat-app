import { Category } from "../entity";
import { Field, ObjectType } from "type-graphql";
import { MyError } from "./MyError";

@ObjectType()
export class CategoryResponse {
  @Field(() => Category, { nullable: true })
  payload?: Category;

  @Field(() => [MyError], { nullable: true })
  errors?: MyError[];
}
