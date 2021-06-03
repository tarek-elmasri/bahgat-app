import { Role } from "./Role";

declare module "express-session" {
  interface SessionData {
    userUuid?: string;
    cartUuid?: string;
    role?: Role;
  }
}
