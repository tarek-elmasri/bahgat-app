import { OnError } from "../../errors";
import * as yup from "yup";
import { ValidationError } from "yup";
import { ValidatorSchema } from "../../types";

export const uuidV4 = yup
  .string()
  .required("UUID is required.")
  .uuid("Invalid UUID Syntax.");

export const uuidSchema = { id: uuidV4 };

export const myValidator = async <T>(
  schema: any,
  input: Partial<T>
): Promise<{ [key: string]: string[] } | undefined> => {
  return yup
    .object()
    .shape(schema)
    .validate(input, { abortEarly: false })
    .then((_) => undefined)
    .catch((err) => formatError(err));
};

const formatError = (err: any) => {
  let result: { [key: string]: string[] } = {};
  err.inner?.forEach((vErr: ValidationError) => {
    if (vErr.path! in result) {
      result[vErr.path!].push(vErr.message);
    } else {
      result[vErr.path!] = [vErr.message];
    }
  });

  return result;
};

export abstract class InputValidator {
  abstract validateInput(schema: ValidatorSchema): Promise<this>;
  abstract getErrors<T extends OnError>(errorClass?: {
    new (): T;
  }): T | OnError | undefined;
}

// export const myValidator = async <InputType, ErrorType>(
//   schema: any,
//   input: InputType,
//   errorClass: { new (): ErrorType }
// ): Promise<ErrorType | undefined> => {
//   return yup
//     .object()
//     .shape(schema)
//     .validate(input, { abortEarly: false })
//     .then((_) => undefined)
//     .catch((err) => Object.assign(new errorClass(), formatError(err)));
// };

// export const UuidValidator = async (input: { id: string }) => {
//   const uuidValidator = { id: uuidV4 };
//   return Object.assign(
//     new InvalidUuidSyntaxError(),
//     await myValidator(uuidValidator, input)
//   );
// };
