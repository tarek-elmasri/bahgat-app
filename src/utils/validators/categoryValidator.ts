import { InvalidUuidSyntaxError } from "../../errors";
import * as yup from "yup";
import { myValidator, uuidV4 } from "./myValidator";
import {
  NewCategoryInput,
  CreateCategoryErrors,
  UpdateCategoryInput,
  UpdateCategoryErrors,
} from "../../types";

const name = yup
  .string()
  .required("Name field is required.")
  .min(4, "Name must be at least of 4 characters");

const description = yup
  .string()
  .required("Description field is required.")
  .min(4, "Description is Too Short.");

export const categorySchemaValidators = { name, description };

export const categoryValidator = (input: { uuid: string }) => {
  const uuidValidator = { uuid: uuidV4 };
  return myValidator(uuidValidator, input, InvalidUuidSyntaxError);
};

export const createCategoryValidator = (input: NewCategoryInput) => {
  const validatorSchema = {
    name,
    description,
  };
  return myValidator(validatorSchema, input, CreateCategoryErrors);
};

export const updateCategoryValidator = (input: UpdateCategoryInput) => {
  const validatorSchema = {
    uuid: uuidV4,
    name,
    description,
  };
  return myValidator(
    validatorSchema,
    { uuid: input.uuid, ...input.fields },
    UpdateCategoryErrors
  );
};
