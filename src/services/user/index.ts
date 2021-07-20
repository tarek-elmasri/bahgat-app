export * from "./registeration";
export * from "./userBaseServices";
export * from "./authentication";
export * from "./resetPassword";
export * from "./me";
export * from "./updateMe";
export * from "./updatePhoneNo";
export * from "./forgetPassword";
import {
  //UserBaseServices,
  RegisterationServices,
  UserAuthentication,
  ResetPassword,
  Me,
  UpdateMe,
  CreateUpdatePhoneNo,
  ForgetPassword,
} from ".";

export const userServices = [
  //UserBaseServices,
  Me,
  UpdateMe,
  CreateUpdatePhoneNo,
  RegisterationServices,
  UserAuthentication,
  ResetPassword,
  ForgetPassword,
];
