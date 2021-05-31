import { MyContext } from "../types/MyContext";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Cart } from "../entity/Cart";
import { Err } from "../errors/Err";
import { CartResponse } from "../types/CartResponse";
import { CartsItems } from "../entity/CartsItems";
import { Item } from "../entity/Item";
import { ErrCode } from "../errors/codes";

export const createNewCart = async (
  sessionId: string,
  userUuid?: string
): Promise<Cart | undefined> => {
  try {
    const newCart = Cart.create({ sessionId, userUuid });
    return await newCart.save();
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
@Resolver()
export class CartResolver {
  @Query(() => CartResponse)
  async myCart(@Ctx() { req }: MyContext): Promise<CartResponse> {
    let cart;

    try {
      if (!req.session.cartUuid && !req.session.userUuid) {
        cart = await createNewCart(req.sessionID);
        req.session.cartUuid = cart?.uuid;
        return {
          payload: cart,
        };
      }

      cart = await Cart.findOne({ where: { sessionId: req.sessionID } });

      return {
        payload: cart,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => CartResponse)
  async addItemToCart(
    @Arg("itemUuid") itemUuid: string,
    @Arg("quantity") quantity: number,
    @Ctx() { req }: MyContext
  ): Promise<CartResponse> {
    try {
      const item = await Item.findOne({ where: { uuid: itemUuid } });
      if (!item) throw new Err(ErrCode.NOT_FOUND, "No Item found for this ID.");

      const newCartItem = CartsItems.create({
        cartUuid: req.session.cartUuid,
        itemUuid,
        quantity,
      });

      await newCartItem.save();

      const cart = await Cart.findOne({
        where: { uuid: req.session.cartUuid },
        relations: ["cartItems"],
      });
      return { payload: cart };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }
}
