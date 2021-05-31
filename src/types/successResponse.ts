import { Field, ObjectType } from "type-graphql";
import { MyError } from "./MyError";

@ObjectType()
export class SuccessResponse {
  @Field(() => Boolean, { nullable: true })
  ok?: boolean;

  @Field(() => [MyError], { nullable: true })
  errors?: MyError[];
}
