import DataLoader from "dataloader";
import { In } from "typeorm";
import { CartsItems, Item } from "../entity";

type BatchFn = (itemIds: readonly string[]) => Promise<Item[][]>;
export const batchCarts: BatchFn = async (itemIds: readonly string[]) => {
  const cartItems = await CartsItems.find({
    join: {
      alias: "cartItem",
      innerJoinAndSelect: {
        item: "cartItem.cart",
      },
    },
    where: {
      itemId: In(itemIds as string[]),
    },
  });

  /*
  [
    {
      __item__: {

      }
    }
  ]

  */

  const itemIdToCart: { [key: string]: Item[] } = {};

  cartItems.forEach((ci) => {
    if (ci.cartId in itemIdToCart) {
      itemIdToCart[ci.itemId].push((ci as any).__cart__);
    } else {
      itemIdToCart[ci.itemId] = [(ci as any).__cart__];
    }
  });

  return itemIds.map((itemId) => itemIdToCart[itemId]);
};

export const cartLoader = () => new DataLoader<string, Item[]>(batchCarts);
