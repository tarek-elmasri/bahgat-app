import {
  createLoginSchema,
  createRegistrationSchema,
  loginSchema,
  registerSchema,
  updateMeSchema,
} from "../utils/validators";

type CreateRegistrationSchema = typeof createRegistrationSchema;
type RegisterSchema = typeof registerSchema;
type LoginSchema = typeof loginSchema;
type CreateLoginSchema = typeof createLoginSchema;
type UpdateMeSchema = typeof updateMeSchema;

export type ValidatorSchema =
  | CreateRegistrationSchema
  | RegisterSchema
  | LoginSchema
  | CreateLoginSchema
  | UpdateMeSchema;
