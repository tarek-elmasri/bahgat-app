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
          where: { uuid: req.session.cartUuid },
          relations: ["cartItems"],
        }),
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => PayloadResponse)
  async addItemToCart(
    @Arg("itemUuid") itemUuid: string,
    @Arg("quantity") quantity: number,
    @Ctx() { req }: MyContext
  ): Promise<PayloadResponse> {
    try {
      const item = await Item.findOne({ where: { uuid: itemUuid } });
      if (!item) throw new Err(ErrCode.NOT_FOUND, "No Item found for this ID.");

      await CartsItems.create({
        cartUuid: req.session.cartUuid,
        itemUuid,
        quantity,
      }).save();

      return { payload: item };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }
}
