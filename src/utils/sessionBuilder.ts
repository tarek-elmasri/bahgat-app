import { Cart } from "../entity/Cart";
import { Request, Response, NextFunction } from "express";
import { Role } from "../types";

type mwFn = (req: Request, res: Response, next: NextFunction) => Promise<void>;
const sessionBuilder: mwFn = async (req, _res, next) => {
  const { cartUuid, role, id, userUuid } = req.session;

  if (!cartUuid && !userUuid) {
    //create new cart for session
    const cart = await Cart.create({
      sessionId: id,
    }).save();
    req.session.cartUuid = cart.uuid;
  }

  if (!role && !userUuid) {
    req.session.role = Role.GUEST;
  }

  next();
};

export default sessionBuilder;
