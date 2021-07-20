import * as yup from "yup";
import { uuidV4 } from "./myValidator";

const name = yup
  .string()
  .required("Name field is required.")
  .min(4, "Name must be at least of 4 characters");

const description = yup
  .string()
  .required("Description field is required.")
  .min(4, "Description is Too Short.");

export const newCategorySchema = { name, description };
export const categorySchemaValidators = { name, description };

// export const createCategoryValidator = (input: NewCategoryInput) => {
//   const validatorSchema = {
//     name,
//     description,
//   };
//   return myValidator(validatorSchema, input /*CreateCategoryErrors*/);
// };

export const updateCategorySchema = { id: uuidV4, name, description };
// export const updateCategoryValidator = (input: UpdateCategoryInput) => {
//   const validatorSchema = {
//     id: uuidV4,
//     name,
//     description,
//   };
//   return myValidator(
//     validatorSchema,
//     { id: input.id, ...input.fields }
//     //UpdateCategoryErrors
//   );
// };
