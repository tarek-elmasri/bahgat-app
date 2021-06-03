//import DataLoader from "dataloader";
import DataLoader from "dataloader";
import { In } from "typeorm";
import { CartsItems } from "../entity/CartsItems";
import { Item } from "../entity/Item";

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
      itemUuid: In(itemIds as string[]),
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
    if (ci.cartUuid in itemIdToCart) {
      itemIdToCart[ci.itemUuid].push((ci as any).__cart__);
    } else {
      itemIdToCart[ci.itemUuid] = [(ci as any).__cart__];
    }
  });

  return itemIds.map((itemUuid) => itemIdToCart[itemUuid]);
};

export const cartLoader = () => new DataLoader<string, Item[]>(batchCarts);
