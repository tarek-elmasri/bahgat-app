// // import { MyContext } from "../types";
// // import { createMethodDecorator } from "type-graphql";
// import { myValidator, uuidSchema } from "../utils/validators";

// // export function CurrentUser() {
// //   return createMethodDecorator<MyContext>(async ({ context }, next) => {
// //     // here place your middleware code that uses custom decorator arguments
// //     if (!context.req.user) throw new Error("Not Logged In");
// //     // e.g. validation logic based on schema using joi
// //     return next();
// //   });
// // }

// export const randomInteger = (min: number, max: number) => {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// };

// const testing = async () => {
//   console.log(
//     await myValidator(uuidSchema, {
//       id: "3434534.asdfs.##F",
//       email: "dsds@gmal",
//     })
//   );
// };

// testing();

let str = " ! s ";
let tex = "";
const result = str.match(/\w+/g)?.forEach((word) => (tex = tex + word + " "));
tex = tex.trim();
//const replacing = result?.map((word) => word.replace(/^"([^"]+)"$/, "$1"));
console.log(str);
console.log(tex.length);
