import { InvalidUuidSyntaxError } from "../../errors";
import * as yup from "yup";
import { ValidationError } from "yup";

export const uuidV4 = yup
  .string()
  .required("UUID is required.")
  .uuid("Invalid UUID Syntax.");

export const UuidValidator = (input: { uuid: string }) => {
  const uuidValidator = { uuid: uuidV4 };
  return myValidator(uuidValidator, input, InvalidUuidSyntaxError);
};

export const myValidator = async <InputType, ErrorType>(
  schema: any,
  input: InputType,
  errorClass: { new (): ErrorType }
): Promise<ErrorType | undefined> => {
  return yup
    .object()
    .shape(schema)
    .validate(input, { abortEarly: false })
    .then((_) => undefined)
    .catch((err) => Object.assign(new errorClass(), formatError(err)));
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
