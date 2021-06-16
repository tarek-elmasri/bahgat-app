import { getConnection } from "typeorm";
import { Cart, CartsItems } from "../entity";
import { updateSession } from "./sessionBuilder";
import { Request, Response } from "express";

type SyncCartFn = (req: Request, res: Response) => Promise<void>;

export const syncCart: SyncCartFn = async (req, res) => {
  const { session, user } = req;

  const userCart = await Cart.findOne({
    where: { userUuid: user!.uuid },
  });

  //updating cartItems to the user Cart
  await getConnection()
    .getRepository(CartsItems)
    .createQueryBuilder()
    .update()
    .set({ cartUuid: userCart!.uuid })
    .where(`cartUuid = :cartUuid`, { cartUuid: session.cartUuid }) //current session cart
    .execute();

  //deleting current session cart
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Cart)
    .where("uuid = :uuid", { uuid: session.cartUuid })
    .execute();

  //setting current session to user cart
  session.cartUuid = userCart!.uuid;
  await updateSession(session, user!, req, res);
};
