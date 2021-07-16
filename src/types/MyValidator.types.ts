import {
  createItemSchema,
  createLoginSchema,
  createRegistrationSchema,
  createResetPasswordSchema,
  loginSchema,
  newCategorySchema,
  registerSchema,
  resetPasswordSchema,
  updateCategorySchema,
  updateItemSchema,
  updateMeSchema,
  uuidSchema,
} from "../utils/validators";

type CreateRegistrationSchema = typeof createRegistrationSchema;
type RegisterSchema = typeof registerSchema;
type LoginSchema = typeof loginSchema;
type CreateLoginSchema = typeof createLoginSchema;
type UpdateMeSchema = typeof updateMeSchema;
type UUIDSchema = typeof uuidSchema;
type NewCategorySchema = typeof newCategorySchema;
type UpdateCategorySchema = typeof updateCategorySchema;
type CreateItemSchema = typeof createItemSchema;
type UpdateItemSchema = typeof updateItemSchema;
type ResetPasswordSchema = typeof resetPasswordSchema;
type CreateResetPasswordSchema = typeof createResetPasswordSchema;

export type ValidatorSchema =
  | UUIDSchema
  | CreateRegistrationSchema
  | RegisterSchema
  | LoginSchema
  | CreateLoginSchema
  | UpdateMeSchema
  | NewCategorySchema
  | UpdateCategorySchema
  | CreateItemSchema
  | UpdateItemSchema
  | CreateResetPasswordSchema
  | ResetPasswordSchema;
