import { MyContext, Role } from "../types";
import { MiddlewareFn } from "type-graphql";
import { ErrCode } from "../errors/codes";
import { Err } from "../errors/Err";

// export enum AuthorizationType {
//   viewAllUsers = "viewAllUsers",
//   updateUser = "updateUser",
//   deleteUser = "deleteUser",
//   addItem = "addItem",
//   updateItem = "updateItem",
//   deleteItem = "deleteItem",
//   addCategory = "addCategory",
//   updateCategory = "updateCategory",
//   deleteCategory = "deleteCategory",
// }

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

    if (role === Role.GUEST)
      throw new Err(ErrCode.NOT_AUTHORIZED, "The request is unauthorized.");

    if (!user?.authorization)
      throw new Err(
        ErrCode.NOT_AUTHORIZED,
        "No Authorization found for this user"
      );

    let reqAuth = Object.assign({}, user.authorization);

    keys.map((key) => {
      if (!reqAuth[key])
        throw new Err(ErrCode.NOT_AUTHORIZED, "UnAuthorized Request.");
    });

    return next();
  };
