import { MyContext, PayloadResponse } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Err, ErrCode } from "../errors";
import { Cart, CartsItems, Item } from "../entity";

@Resolver()
export class CartResolver {
  @Query(() => PayloadResponse)
  async myCart(@Ctx() { req }: MyContext): Promise<PayloadResponse> {
    try {
      return {
        payload: await Cart.findOne({
          where: { uuid: req.session.cartId },
        }),
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => PayloadResponse)
  async addItemToCart(
    @Arg("itemId") itemId: string,
    @Arg("quantity") quantity: number,
    @Ctx() { req }: MyContext
  ): Promise<PayloadResponse> {
    try {
      const item = await Item.findOne({ where: { id: itemId } });
      if (!item) throw new Err(ErrCode.NOT_FOUND, "No Item found for this ID.");

      await CartsItems.create({
        cartId: req.session.cartId,
        itemId,
        quantity,
      }).save();

      return { payload: item };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }
}
