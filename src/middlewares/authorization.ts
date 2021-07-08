import { MyContext, Role } from "../types";
import { MiddlewareFn } from "type-graphql";
import { ErrCode, Err } from "../errors";
import { UnAuthorizedError } from "../errors/Errors";

type AuthorizationType =
  | "viewAllUsers"
  | "updateUser"
  | "deleteUser"
  | "addItem"
  | "updateItem"
  | "deleteItem"
  | "addCategory"
  | "updateCategory"
  | "deleteCategory";

type AuthorizationFn = (keys: AuthorizationType[]) => MiddlewareFn<MyContext>;

export const isAuthorized: AuthorizationFn =
  (keys): MiddlewareFn<MyContext> =>
  async ({ context }, next) => {
    const { user } = context.req;
    const role = user?.role || Role.GUEST;

    if (role === Role.ADMIN) return next();

    if (role === Role.GUEST || !user?.authorization)
      throw new UnAuthorizedError("Unauthorized Request");

    let reqAuth = Object.assign({}, user.authorization);

    keys.map((key) => {
      if (!reqAuth[key]) throw new UnAuthorizedError("Unauthorized Request");
    });

    return next();
  };

export const isGuest: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (context.req.user)
    throw new Err(ErrCode.INVALID_ACTION, "User already logged in.");

  return next();
};
