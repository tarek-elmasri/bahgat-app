import { BadRequestError } from "../../errors";
import { MyContext } from "../../types";
import { createMethodDecorator } from "type-graphql";

export function isGuest() {
  return createMethodDecorator<MyContext>(async ({ context }, next) => {
    if (context.req.user) throw new BadRequestError("User already logged in.");
    return next();
  });
}
