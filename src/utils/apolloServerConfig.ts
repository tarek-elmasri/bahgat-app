import { ApolloServer } from "apollo-server-express";
import {
  CartResolver,
  CategoryResolver,
  ItemResolver,
  UserResolver,
} from "../resolvers";
import { buildSchema } from "type-graphql";
import { MyContext } from "../types";
import { itemLoader } from "../loaders/ItemLoader";
import { cartLoader } from "../loaders/cartLoader";

export const apolloServerConfig = async (): Promise<ApolloServer> => {
  return new ApolloServer({
    schema: await buildSchema({
      resolvers: [ItemResolver, CategoryResolver, UserResolver, CartResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      itemsLoader: itemLoader(),
      cartsLoader: cartLoader(),
    }),
  });
};
