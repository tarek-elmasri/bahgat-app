import { MyContext } from "../types";
import { createMethodDecorator } from "type-graphql";

export function CurrentUser() {
  return createMethodDecorator<MyContext>(async ({ context }, next) => {
    // here place your middleware code that uses custom decorator arguments
    if (!context.req.user) throw new Error("Not Logged In");
    // e.g. validation logic based on schema using joi
    return next();
  });
}
