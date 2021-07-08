import { MyContext } from "../types";
import { createMethodDecorator } from "type-graphql";
// import { formatError } from "../utils";

// const uuid = yup
//   .string()
//   .required("ID is required.")
//   .uuid("Invalid UUID Syntax");

// const username = yup
//   .string()
//   .required("username required")
//   .min(4, "Username must be at least of 4 characters");
// const password = yup
//   .string()
//   .required("password requird")
//   .min(4, "Password must be at least of 4 characters");
// const email = yup
//   .string()
//   .required("required email.")
//   .email("Invalid Email Address.");

// export const userSchemaValidators = { uuid, username, password, email };

// export const RegisterInputValidator = async (
//   input: RegisterInput
// ): Promise<RegisterErrors | undefined> => {
//   return yup
//     .object()
//     .shape({
//       username,
//       password,
//       email,
//     })
//     .validate(input, { abortEarly: false })
//     .then((_) => undefined)
//     .catch((err) => Object.assign(new RegisterErrors(), formatError(err)));
// };

export function CurrentUser() {
  return createMethodDecorator<MyContext>(async ({ context }, next) => {
    // here place your middleware code that uses custom decorator arguments
    if (!context.req.user) throw new Error("Not Logged In");
    // e.g. validation logic based on schema using joi
    return next();
  });
}
