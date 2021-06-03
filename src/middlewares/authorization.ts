import { MyContext, Role } from "../types";
import { MiddlewareFn, NextFn } from "type-graphql";
import { Err } from "../errors/Err";
import { ErrCode } from "../errors/codes";

type AuthorizationFn = (
  context: MyContext,
  next: NextFn,
  key: Role
) => Promise<any>;

const isAuthorized: AuthorizationFn = async ({ req }, next, key) => {
  const { role } = req.session;

  let pass = false;

  console.log("key: ", key, " role :", role);
  if (key === Role.STAFF) {
    pass = role === Role.STAFF || role === Role.ADMIN;
  } else {
    pass = role === key;
  }

  if (!pass) {
    throw new Err(ErrCode.NOT_AUTHORIZED, "The request is unauthorized.");
  }

  return next();
};

export const isStaff: MiddlewareFn<MyContext> = ({ context }, next) =>
  isAuthorized(context, next, Role.STAFF);

export const isAdmin: MiddlewareFn<MyContext> = ({ context }, next) =>
  isAuthorized(context, next, Role.ADMIN);

export const isGuest: MiddlewareFn<MyContext> = ({ context }, next) =>
  isAuthorized(context, next, Role.GUEST);
