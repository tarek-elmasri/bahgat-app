import { ForbiddenError } from "apollo-server-express";
import { MyContext, Role } from "../../types";
import { createMethodDecorator } from "type-graphql";

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

export function isAuthorized(keys: AuthorizationType[]) {
  return createMethodDecorator<MyContext>(async ({ context }, next) => {
    const { user } = context.req;
    const role = user?.role;

    if (role === Role.ADMIN) return next();

    if (!user?.authorization)
      throw new ForbiddenError(
        "Access denied! You need to be authorized to perform this action!"
      );

    let reqAuth = Object.assign({}, user.authorization);

    keys.map((key) => {
      if (!reqAuth[key])
        throw new ForbiddenError(
          "Access denied! You need to be authorized to perform this action!"
        );
    });

    return next();
  });
}
