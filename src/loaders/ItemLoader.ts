import DataLoader from "dataloader";
import { In } from "typeorm";
import { CartsItems, Item } from "../entity";

type BatchFn = (cartIds: readonly string[]) => Promise<Item[][]>;
export const batchItems: BatchFn = async (cartIds: readonly string[]) => {
  const cartItems = await CartsItems.find({
    join: {
      alias: "cartItem",
      innerJoinAndSelect: {
        item: "cartItem.item",
      },
    },
    where: {
      cartId: In(cartIds as string[]),
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

  const cartIdToItem: { [key: string]: Item[] } = {};

  cartItems.forEach((ci) => {
    if (ci.cartId in cartIdToItem) {
      cartIdToItem[ci.cartId].push((ci as any).__item__);
    } else {
      cartIdToItem[ci.cartId] = [(ci as any).__item__];
    }
  });

  return cartIds.map((cartId) => cartIdToItem[cartId]);
};

export const itemLoader = () => new DataLoader<string, Item[]>(batchItems);
