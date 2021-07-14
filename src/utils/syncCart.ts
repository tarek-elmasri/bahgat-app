import { getConnection } from "typeorm";
import { Cart, CartsItems, Session, User } from "../entity";
import { Err, ErrCode } from "../errors";

type SyncCartFn = (user: User, session: Session) => Promise<Cart>;

/*
  this function updates all carts_items cartUuid field of guest cart
  to the current user cart UUID
  then deletes the current cart whick will be with no items
  and returns 

*/
export const syncCart: SyncCartFn = async (user, session) => {
  const userCart = await Cart.findOne({
    where: { userId: user.id },
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
    .set({ cartId: userCart.id })
    .where(`cartId = :cartId`, { cartId: session.cartId }) //current session cart
    .execute();

  //deleting current session cart
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(Cart)
    .where("id = :id", { id: session.cartId })
    .execute();

  return userCart;
};
