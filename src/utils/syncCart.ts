import { getConnection } from "typeorm";
import { Cart, CartsItems, User } from "../entity";
import { Request } from "express";
import { Err, ErrCode } from "../errors";

type SyncCartFn = (user: User, req: Request) => Promise<Cart>;

export const syncCart: SyncCartFn = async (user, req) => {
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

  return userCart;
};
