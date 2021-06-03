import { MyContext, CartResponse, ItemResponse } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Err } from "../errors/Err";
import { Cart, CartsItems, Item } from "../entity";
import { ErrCode } from "../errors/codes";

@Resolver()
export class CartResolver {
  @Query(() => CartResponse)
  async myCart(@Ctx() { req }: MyContext): Promise<CartResponse> {
    try {
      const cart = await Cart.findOne({
        where: { sessionId: req.sessionID },
        relations: ["cartItems"],
      });

      return {
        payload: cart,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => ItemResponse)
  async addItemToCart(
    @Arg("itemUuid") itemUuid: string,
    @Arg("quantity") quantity: number,
    @Ctx() { req }: MyContext
  ): Promise<ItemResponse> {
    try {
      const item = await Item.findOne({ where: { uuid: itemUuid } });
      if (!item) throw new Err(ErrCode.NOT_FOUND, "No Item found for this ID.");

      const newCartItem = CartsItems.create({
        cartUuid: req.session.cartUuid,
        itemUuid,
        quantity,
      });

      await newCartItem.save();

      return { payload: item };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }
}
