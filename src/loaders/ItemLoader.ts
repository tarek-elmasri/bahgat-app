//import DataLoader from "dataloader";
import DataLoader from "dataloader";
import { In } from "typeorm";
import { CartsItems } from "../entity/CartsItems";
import { Item } from "../entity/Item";

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
      cartUuid: In(cartIds as string[]),
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
    if (ci.cartUuid in cartIdToItem) {
      cartIdToItem[ci.cartUuid].push((ci as any).__item__);
    } else {
      cartIdToItem[ci.cartUuid] = [(ci as any).__item__];
    }
  });

  return cartIds.map((cartUuid) => cartIdToItem[cartUuid]);
};

export const itemLoader = () => new DataLoader<string, Item[]>(batchItems);
