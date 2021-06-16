import { cartLoader } from "../loaders/cartLoader";
import { itemLoader } from "../loaders/ItemLoader";
import { Response, Request } from "express";

export interface MyContext {
  req: Request;
  res: Response;
  itemsLoader: ReturnType<typeof itemLoader>;
  cartsLoader: ReturnType<typeof cartLoader>;
}
