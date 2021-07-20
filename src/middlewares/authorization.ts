// import { AuthenticationError, ForbiddenError } from "apollo-server-express";
// import { MyContext } from "../types";
// import { MiddlewareFn } from "type-graphql";

// // type AuthorizationType =
// //   | "viewAllUsers"
// //   | "updateUser"
// //   | "deleteUser"
// //   | "addItem"
// //   | "updateItem"
// //   | "deleteItem"
// //   | "addCategory"
// //   | "updateCategory"
// //   | "deleteCategory";

// // export function isAuthorized(keys: AuthorizationType[]) {
// //   return createMethodDecorator<MyContext>(async ({ context }, next) => {
// //     const { user } = context.req;
// //     const role = user?.role;

// //     if (role === Role.ADMIN) return next();

// //     if (!user?.authorization)
// //       throw new ForbiddenError(
// //         "Access denied! You need to be authorized to perform this action!"
// //       );

// //     let reqAuth = Object.assign({}, user.authorization);

// //     keys.map((key) => {
// //       if (!reqAuth[key])
// //         throw new ForbiddenError(
// //           "Access denied! You need to be authorized to perform this action!"
// //         );
// //     });

// //     return next();
// //   });
// // }

// export const isGuest: MiddlewareFn<MyContext> = ({ context }, next) => {
//   console.log("is here");
//   if (context.req.user) throw new ForbiddenError("User already logged in.");
//   return next();
// };

// // export function isGuestt() {
// //   return createMethodDecorator<MyContext>(async ({ context }, next) => {
// //     if (context.req.user) throw new BadRequestError("User already logged in.");
// //     return next();
// //   });
// // }
// // export function CurrentUser() {
// //   return createMethodDecorator<MyContext>(async ({ context }, next) => {
// //     if (!context.req.user)
// //       throw new AuthenticationError(
// //         "Access denied! You need to be logged in to perform this action!"
// //       );
// //     return next();
// //   });
// // }

// // export const CurrentUser: MiddlewareFn<MyContext> = ({ context }, next) => {
// //   if (!context.req.user)
// //     throw new AuthenticationError(
// //       "Access denied! You need to be logged in to perform this action!"
// //     );
// //   return next();
// // };

// // type AuthorizationFn = (keys: AuthorizationType[]) => MiddlewareFn<MyContext>;

// // export const isAuthorized: AuthorizationFn =
// //   (keys): MiddlewareFn<MyContext> =>
// //   async ({ context }, next) => {
// //     const { user } = context.req;
// //     const role = user?.role || Role.GUEST;

// //     if (role === Role.ADMIN) return next();

// //     if (role === Role.GUEST || !user?.authorization)
// //       throw new UnauthorizedError();

// //     let reqAuth = Object.assign({}, user.authorization);

// //     keys.map((key) => {
// //       if (!reqAuth[key]) throw new UnauthorizedError();
// //     });

// //     return next();
// //   };
