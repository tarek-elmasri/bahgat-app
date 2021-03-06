import { cartLoader } from "../loaders/cartLoader";
import { itemLoader } from "../loaders/ItemLoader";
import { Response, Request } from "express";
import { User, Session, Cart } from "../entity";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      cart: Cart;
      session: Session;
    }
  }
}

export interface MyContext {
  req: Request;
  res: Response;
  itemsLoader: ReturnType<typeof itemLoader>;
  cartsLoader: ReturnType<typeof cartLoader>;
}
