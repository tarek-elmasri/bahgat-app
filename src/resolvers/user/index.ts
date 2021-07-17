export * from "./registeration";
export * from "./userBaseServices";
export * from "./authentication";
export * from "./resetPassword";
export * from "./me";
export * from "./updateMe";
export * from "./updatePhoneNo";
import {
  UserBaseServices,
  RegisterationServices,
  UserAuthentication,
  ResetPassword,
  Me,
  UpdateMe,
  CreateUpdatePhoneNo,
} from "./";

export const userServices = [
  UserBaseServices,
  Me,
  UpdateMe,
  CreateUpdatePhoneNo,
  RegisterationServices,
  UserAuthentication,
  ResetPassword,
];
