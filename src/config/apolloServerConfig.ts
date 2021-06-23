import { ApolloServer } from "apollo-server-express";
import {
  CartResolver,
  CategoryResolver,
  ItemResolver,
  UserResolver,
} from "../resolvers";
import { buildSchema } from "type-graphql";

import { itemLoader } from "../loaders/ItemLoader";
import { cartLoader } from "../loaders/cartLoader";
import { panel_userResolver } from "../resolvers/admin_panel/panel_userResolver";

export const apolloServerConfig = async (): Promise<ApolloServer> => {
  return new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        ItemResolver,
        CategoryResolver,
        UserResolver,
        CartResolver,
        panel_userResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      itemsLoader: itemLoader(),
      cartsLoader: cartLoader(),
    }),
  });
};