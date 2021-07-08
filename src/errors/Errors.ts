import { ApolloError } from "apollo-server-express";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class OnError {
  @Field()
  code: string;

  @Field()
  message: string;

  constructor(
    code: string = "InputError",
    message: string = "invalid input parameters"
  ) {
    this.code = code;
    this.message = message;
  }
}

@ObjectType()
export class InvalidUuidSyntaxError implements OnError {
  @Field()
  code: string;

  @Field()
  message: string;

  @Field(() => [String], { nullable: true })
  uuid?: string[];

  constructor(
    code: string = "UUID_INVALID-SYNTAX",
    message: string = "Invalid Uuid syntax",
    uuid: string[] = ["Invalid Uuid syntax"]
  ) {
    this.code = code;
    this.message = message;
    this.uuid = uuid;
  }
}
// export class UuidInvalidSyntaxError extends ApolloError {
//   constructor(message: string, extension?: Record<string, any>) {
//     super(message, "Invalid Uuid Syntax", extension);
//   }
// }

export class UnAuthorizedError extends ApolloError {
  constructor(message: string, extension?: Record<string, any>) {
    super(message, "UNAUTHORIZED", extension);
  }
}
