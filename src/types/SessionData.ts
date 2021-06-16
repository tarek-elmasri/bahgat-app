import { User, Session } from "../entity";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      session: Session;
    }
  }
}
