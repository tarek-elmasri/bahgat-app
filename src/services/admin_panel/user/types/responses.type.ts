import { OnError } from "../../../../errors";
import { Field, ObjectType } from "type-graphql";
import { User } from "../../../../entity";

@ObjectType()
export class UpdateAuthorizationErrors extends OnError {
  @Field()
  code: string;

  @Field()
  message: string;

  @Field(() => [String], { nullable: true })
  id?: string[];

  @Field(() => [String], { nullable: true })
  role?: string[];

  constructor(code?: string, message?: string, id?: string[], role?: string[]) {
    super(code, message);
    this.id = id;
    this.role = role;
  }
}

@ObjectType()
export class UpdateAuthorizationResponse {
  @Field(() => User, { nullable: true })
  payload?: User;

  @Field(() => UpdateAuthorizationErrors, { nullable: true })
  errors?: UpdateAuthorizationErrors;
}
