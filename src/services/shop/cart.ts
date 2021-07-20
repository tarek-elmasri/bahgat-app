import { CartsItems, Item } from "../../entity";
import { MyContext } from "../../types";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import {
  AddItemToCartErrors,
  addItemToCartResponse,
} from "./types/responses.type";
import { addItemToCartSchema } from "../../utils/validators";

@Resolver()
export class CartServices {
  @Mutation(() => addItemToCartResponse)
  async addItemToCart(
    @Arg("itemId") itemId: string,
    @Arg("quantity") quantity: number,
    @Ctx() { req }: MyContext
  ): Promise<addItemToCartResponse> {
    const newCartItem = await CartsItems.create({
      itemId,
      quantity,
      cartId: req.session.cartId,
    }).validateInput(addItemToCartSchema);
    const errors = newCartItem.getErrors(AddItemToCartErrors);
    if (errors) return { errors };

    const item = await Item.findOne({ where: { id: itemId } });
    if (!item)
      return {
        errors: {
          code: "NOT_FOUND",
          message: "No item exists for this ID.",
          itemId: ["Invalid itemId."],
        },
      };

    return { payload: await newCartItem.save() };
  }
}
