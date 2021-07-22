import { createOrderSchema } from "src/utils/validators/orderValidator";
import {
  addItemToCartSchema,
  createForgetPasswordSchema,
  createItemSchema,
  createLoginSchema,
  createRegistrationSchema,
  createResetPasswordSchema,
  createUpdatePhoneNoSchema,
  forgetPasswordSchema,
  loginSchema,
  newCategorySchema,
  registerSchema,
  resetPasswordSchema,
  updateCategorySchema,
  updateItemSchema,
  updateMeSchema,
  updatePhoneNoSchema,
  uuidSchema,
} from "../utils/validators";

export type ValidatorSchema =
  | typeof uuidSchema
  | typeof createRegistrationSchema
  | typeof registerSchema
  | typeof loginSchema
  | typeof createLoginSchema
  | typeof updateMeSchema
  | typeof newCategorySchema
  | typeof updateCategorySchema
  | typeof createItemSchema
  | typeof updateItemSchema
  | typeof createResetPasswordSchema
  | typeof resetPasswordSchema
  | typeof createUpdatePhoneNoSchema
  | typeof updatePhoneNoSchema
  | typeof createForgetPasswordSchema
  | typeof forgetPasswordSchema
  | typeof addItemToCartSchema
  | typeof createOrderSchema;
