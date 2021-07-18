import {
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

// type CreateRegistrationSchema = typeof createRegistrationSchema;
// type RegisterSchema = typeof registerSchema;
// type LoginSchema = typeof loginSchema;
// type CreateLoginSchema = typeof createLoginSchema;
// type UpdateMeSchema = typeof updateMeSchema;
// type UUIDSchema = typeof uuidSchema;
// type NewCategorySchema = typeof newCategorySchema;
// type UpdateCategorySchema = typeof updateCategorySchema;
// type CreateItemSchema = typeof createItemSchema;
// type UpdateItemSchema = typeof updateItemSchema;
// type ResetPasswordSchema = typeof resetPasswordSchema;
// type CreateResetPasswordSchema = typeof createResetPasswordSchema;
// type CreateUpdatePhoneNo = typeof createUpdatePhoneNoSchema;
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
  | typeof forgetPasswordSchema;
