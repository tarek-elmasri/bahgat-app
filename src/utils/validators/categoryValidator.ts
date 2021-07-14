import * as yup from "yup";
import { myValidator, uuidV4 } from "./myValidator";
import { NewCategoryInput, UpdateCategoryInput } from "../../types";

const name = yup
  .string()
  .required("Name field is required.")
  .min(4, "Name must be at least of 4 characters");

const description = yup
  .string()
  .required("Description field is required.")
  .min(4, "Description is Too Short.");

export const categorySchemaValidators = { name, description };

export const createCategoryValidator = (input: NewCategoryInput) => {
  const validatorSchema = {
    name,
    description,
  };
  return myValidator(validatorSchema, input /*CreateCategoryErrors*/);
};

export const updateCategoryValidator = (input: UpdateCategoryInput) => {
  const validatorSchema = {
    id: uuidV4,
    name,
    description,
  };
  return myValidator(
    validatorSchema,
    { id: input.id, ...input.fields }
    //UpdateCategoryErrors
  );
};
