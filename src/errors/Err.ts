import { ApolloError } from "apollo-server-express";
import { MyError } from "../types";
import { ErrCode } from "./codes";

interface ErrorResponse {
  errors: [MyError];
}
export class Err extends ApolloError {
  code: string;
  field: string | undefined;
  message: string;

  constructor(code: ErrCode, message: string, extention?: Record<string, any>) {
    super(message, code, extention);
    this.code = code;
    this.message = message;
  }

  static ResponseBuilder = (err: any): ErrorResponse => {
    console.log(err.code, err.message);

    let { code, message } = err;
    let field: string | undefined;

    if (code === "23505") {
      message = "Email already exists.";
      field = "Email";
    }

    if (code === "22P02") {
      message = "Invalid UUID Syntax.";
    }

    return {
      errors: [
        {
          code: code,
          message: message || "Bad Request",
          field,
        },
      ],
    };
  };
}
