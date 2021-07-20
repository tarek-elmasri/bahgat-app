import { AuthenticationError } from "apollo-server-express";
import { MyContext } from "../../types";
import { createMethodDecorator } from "type-graphql";

export function CurrentUser() {
  return createMethodDecorator<MyContext>(async ({ context }, next) => {
    if (!context.req.user)
      throw new AuthenticationError(
        "Access denied! You need to be logged in to perform this action!"
      );
    return next();
  });
}
