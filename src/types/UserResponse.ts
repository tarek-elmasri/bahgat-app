import { User } from "../entity/User";
import { Field, ObjectType } from "type-graphql";
import { MyError } from "./MyError";

@ObjectType()
export class UserResponse {
  @Field(() => User, { nullable: true })
  payload?: User;

  @Field(() => [MyError], { nullable: true })
  errors?: MyError[];
}
