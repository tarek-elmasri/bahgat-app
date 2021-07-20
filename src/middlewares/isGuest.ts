import { BadRequestError } from "../errors";
import { createMethodDecorator } from "type-graphql";
import { MyContext } from "../types";


export function isGuestt() {
  return createMethodDecorator<MyContext>(async ({ context }, next) => {
    if (context.req.user) throw new BadRequestError("User already logged in.");
    return next();
  });
}