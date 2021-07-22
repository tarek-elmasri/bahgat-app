import * as yup from "yup";
//   ^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$
const username = yup
  .string()
  .required("username required")
  .trim()
  .matches(
    /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/,
    "Invalid username format"
  )
  .min(5, "Username must be at least of 5 characters")
  .max(20, "username maximum characters is 20.");
const password = yup
  .string()
  .required("password requird")
  .matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])/,
    "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
  )
  .min(5, "Password must be at least of 5 characters");
const email = yup
  .string()
  .required("required email.")
  .trim()
  .email("Invalid Email Address format.");
// .matches(
//   /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
//   "invalid Email Address format."
// );

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

//export const userSchemaValidators = { username, password, email, phoneNo, OTP };
export const createResetPasswordSchema = {
  password,
  newPassword: password,
};
export const resetPasswordSchema = {
  password,
  newPassword: password,
  OTP,
};
export const updateMeSchema = { username, email };

export const createLoginSchema = { email, password, phoneNo };
export const loginSchema = { email, password, phoneNo, OTP };
export const createRegistrationSchema = { username, email, password, phoneNo };
export const registerSchema = { username, email, password, phoneNo, OTP };

export const createUpdatePhoneNoSchema = { phoneNo };
export const updatePhoneNoSchema = { phoneNo, OTP };
export const createForgetPasswordSchema = { newPassword: password, phoneNo };
export const forgetPasswordSchema = { newPassword: password, phoneNo, OTP };

export const userFieldsValidators = {
  username,
  password,
  email,
  phoneNo,
  OTP,
};

export default {
  userFieldsValidators,
  createResetPasswordSchema,
  resetPasswordSchema,
  createLoginSchema,
  updateMeSchema,
  loginSchema,
  createRegistrationSchema,
  registerSchema,
  createUpdatePhoneNoSchema,
  updatePhoneNoSchema,
  createForgetPasswordSchema,
  forgetPasswordSchema,
};
