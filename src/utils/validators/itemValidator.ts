import { newItemInput, updateItemInput } from "../../types";
import * as yup from "yup";
import { myValidator, uuidV4 } from "./myValidator";
//import { NewItemError, UpdateItemErrors } from "../../types/Item.types";

const name = yup.string().min(4, "Must be at least of 4 chars");

const price = yup.number();

const stock = yup.number().integer("Must be of Int value.");

export const categoryId = yup
  .string()
  .notRequired()
  .uuid("Invalid UUID Syntax.");

export const createItemValidator = (input: newItemInput) => {
  const schemaValidator = {
    categoryId: uuidV4,
    name: name.required(),
    price: price.required(),
    stock: stock.required(),
  };
  return myValidator(
    schemaValidator,
    { categoryId: input.categoryId, ...input.fields }
    //NewItemError
  );
};

export const updateItemValidator = (input: updateItemInput) => {
  const schemaValidator = {
    uuid: uuidV4,
    categoryId,
    name: name.notRequired(),
    price: price.notRequired(),
    stock: stock.notRequired(),
  };
  return myValidator(
    schemaValidator,
    { id: input.id, ...input.fields }
    //UpdateItemErrors
  );
};
