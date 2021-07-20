import * as yup from "yup";

const itemId = yup
  .string()
  .required("itemId is required.")
  .uuid("Invalid id syntax");

const quantity = yup.number().required().integer("Invalid quantity type");

export const addItemToCartSchema = { itemId, quantity };
