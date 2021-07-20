import { registerEnumType } from "type-graphql";

export enum Role {
  ADMIN = "Admin",
  STAFF = "STAFF",
  USER = "USER",
}

registerEnumType(Role, {
  name: "Role",
  description: "basic user role.",
});
