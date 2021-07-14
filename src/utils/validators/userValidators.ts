// import {
//   CreateRegisterationErrors,
//   CreateRegistrationInput,
//   LoginInput,
//   RegisterErrors,
//   RegisterInput,
//   UpdateMeErrors,
//   UpdateUserInput,
// } from "../../types";
import * as yup from "yup";
// import { myValidator } from "./myValidator";
// import { OnError } from "../../errors";

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

const phoneNo = yup
  .number()
  .required()
  .integer("Invalid PhoneNo. input value")
  .min(966500000000, "Invalid phoneNo.")
  .max(966599999999, "Invalid PhoneNo.");

const OTP = yup
  .number()
  .required()
  .integer("Invalid OTP Value")
  .min(1000, "Invalid OTP Value")
  .max(9999, "Invalid OTP Value");

export const userSchemaValidators = { username, password, email, phoneNo, OTP };

export const createLoginSchema = { email, password, phoneNo };
export const loginSchema = { email, password, phoneNo, OTP };
// export const loginValidator = (input: LoginInput) => {
//   return myValidator(loginSchema, input, OnError);
// };

export const registerSchema = {
  username,
  email,
  password,
  phoneNo,
  OTP,
};
// export const registerValidator = (input: RegisterInput) => {
//   return myValidator(registerSchema, input, RegisterErrors);
// };

export const createRegistrationSchema = { username, email, password, phoneNo };
// export const createRegisterationValidator = async (
//   input: CreateRegistrationInput
// ) => {
//   const inputErrors = await myValidator(
//     createRegistrationSchema,
//     input,
//     CreateRegisterationErrors
//   );

//   if (inputErrors) return inputErrors;

//   const uniqueErrors = await CreateRegisterationErrors.validateUniqness({
//     email: input.email,
//     phoneNo: input.phoneNo,
//   });

//   if (uniqueErrors) return uniqueErrors;

//   return undefined;
// };

export const updateMeSchema = { username, email, phoneNo };
// export const updateMeValidator = (input: UpdateUserInput) => {
//   return myValidator(updateMeSchema, input, UpdateMeErrors);
// };
