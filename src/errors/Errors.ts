import { ApolloError } from "apollo-server-express";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class OnError {
  @Field()
  code: string;

  @Field()
  message: string;

  constructor(
    code: string = "INVALID_INPUT_PARAMETERS",
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
  id?: string[];

  constructor(
    code: string = "UUID_INVALID-SYNTAX",
    message: string = "Invalid Uuid syntax",
    id: string[] = ["Invalid Uuid syntax"]
  ) {
    this.code = code;
    this.message = message;
    this.id = id;
  }
}
// export class UuidInvalidSyntaxError extends ApolloError {
//   constructor(message: string, extension?: Record<string, any>) {
//     super(message, "Invalid Uuid Syntax", extension);
//   }
// }

export class BadRequestError extends ApolloError {
  constructor(
    message: string = "Bad Request",
    extension?: Record<string, any>
  ) {
    super(message, "BAD_REQUEST", extension);
  }
}
// export class UnAuthorizedError extends ApolloError {
//   constructor(message: string, extension?: Record<string, any>) {
//     super(message, "UNAUTHORIZED", extension);
//   }
// }
