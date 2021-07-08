import {
  LoginInput,
  RegisterErrors,
  RegisterInput,
  UpdateMeErrors,
  UpdateUserInput,
} from "../../types";
import * as yup from "yup";
import { myValidator } from "./myValidator";
import { OnError } from "../../errors";

const username = yup
  .string()
  .required("username required")
  .min(4, "Username must be at least of 4 characters");
const password = yup
  .string()
  .required("password requird")
  .min(4, "Password must be at least of 4 characters");
const email = yup
  .string()
  .required("required email.")
  .email("Invalid Email Address.");

export const userSchemaValidators = { username, password, email };

export const loginValidator = (input: LoginInput) => {
  const validatorSchema = {
    email,
    password,
  };
  return myValidator(validatorSchema, input, OnError);
};

export const registerValidator = (input: RegisterInput) => {
  const validatorSchema = {
    username,
    email,
    password,
  };
  return myValidator(validatorSchema, input, RegisterErrors);
};

export const updateMeValidator = (input: UpdateUserInput) => {
  const validatorSchema = {
    username,
    email,
  };
  return myValidator(validatorSchema, input, UpdateMeErrors);
};
