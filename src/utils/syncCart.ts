import { getConnection } from "typeorm";
import { Cart, CartsItems, User } from "../entity";
import { updateSession } from "../middlewares/sessionBuilder";
import { Request, Response } from "express";
import { Err, ErrCode } from "../errors";

type SyncCartFn = (user: User, req: Request, res: Response) => Promise<void>;

export const syncCart: SyncCartFn = async (user, req, res) => {
  const { session } = req;

  const userCart = await Cart.findOne({
    where: { userUuid: user.uuid },
  });

  if (!userCart)
    throw new Err(
      ErrCode.NOT_FOUND,
      "no cart found for this user, .. internal error"
    );

  //updating cartItems to the user Cart
  await getConnection()
    .getRepository(CartsItems)
    .createQueryBuilder()
    .update()
    .set({ cartUuid: userCart.uuid })
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
  session.cartUuid = userCart.uuid;
  await updateSession(session, user, req, res);
};
