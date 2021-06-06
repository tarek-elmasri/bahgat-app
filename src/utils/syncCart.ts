import { Session, SessionData } from "express-session";
import { getConnection } from "typeorm";
import { Cart, CartsItems, User } from "../entity";

type SyncCartFn = (
  user: User,
  session: Session & Partial<SessionData>
) => Promise<void>;

export const syncCart: SyncCartFn = async (user, session) => {
  const userCart = await Cart.findOne({
    where: { userUuid: user.uuid },
  });

  //updating cartItems to the user Cart
  await getConnection()
    .getRepository(CartsItems)
    .createQueryBuilder()
    .update()
    .set({ cartUuid: userCart?.uuid })
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
  session.cartUuid = userCart?.uuid;
};
