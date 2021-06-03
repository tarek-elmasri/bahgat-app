import { MyError } from "../types";
import { ErrCode } from "./codes";

interface ErrorResponse {
  errors: [MyError];
}
export class Err {
  code: string;
  field: string | undefined;
  message: string | undefined;

  constructor(code: ErrCode, message: string) {
    this.code = code;
    this.message = message;
  }

  static ResponseBuilder = (err: any): ErrorResponse => {
    console.log(err.code, err.message);

    let { code, message } = err;
    let field: string;

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
        },
      ],
    };
  };
}
