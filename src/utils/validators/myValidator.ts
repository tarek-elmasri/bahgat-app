import niv from "node-input-validator";
import { ErrCode } from "../../errors";
import { MyError } from "../../types";

export const updateUserRules = {
  username: "required|minLength:4",
  email: "required|email",
};

export const createUserRules = {
  username: "required|minLength:4",
  email: "required|email",
  password: "required|minLength:4",
};

export const createCategoryRules = {
  name: "required|minLength:4",
  description: "required|minLength:4",
};

export const createItemRules = {
  name: "required|minLength:4",
};

const extendedMessages = {
  required: "Required Field.",
  minLength: "Too short.",
  email: "Invalid Email format.",
};

export const myValidator = async (
  input: any,
  rules: any
): Promise<MyError[] | undefined> => {
  const validator = new niv.Validator(input, rules);
  niv.extendMessages(extendedMessages);
  validator.bail(false);

  await validator.check();

  const { errors } = validator;

  if (Object.keys(errors).length < 1) return undefined;

  let myErrors: MyError[] = [];

  //formatting niv errors into MyError Type
  Object.keys(errors).forEach((field) => {
    (errors[field] as [{ rule: string; message: string }]).forEach((err) => {
      myErrors.push({
        field,
        message: err.message,
        code: ErrCode.INVAID_INPUT_PARAMETER,
      });
    });
  });

  return myErrors;
};
