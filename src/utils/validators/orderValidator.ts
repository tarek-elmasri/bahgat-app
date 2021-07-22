import * as yup from "yup";
import userValidators from "./userValidators";

const phoneNo = userValidators.userFieldsValidators.phoneNo;
const street = yup
  .string()
  .required("street field is required.")
  .trim()
  .min(2, "Minimum chars for street is 2.")
  .max(20, "Exceeded maximum chars for street field.");

const address = yup
  .string()
  .required("address field is required.")
  .trim()
  .min(2, "Minimum chars for street is 2.")
  .max(20, "Exceeded maximum chars for street field.");

const city = yup
  .string()
  .required("city field is required.")
  .trim()
  .min(2, "Minimum chars for street is 2.")
  .max(20, "Exceeded maximum chars for street field.");

const paymentMethod = yup.string().required("Payment method is required.");

const orderFieldsValidators = { phoneNo, paymentMethod, street, address, city };

export const createOrderSchema = {
  phoneNo,
  paymentMethod,
  street,
  address,
  city,
};
export default {
  orderFieldsValidators,
  createOrderSchema,
};
