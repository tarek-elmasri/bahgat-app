import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import { itemLoader } from "../loaders/ItemLoader";
import { cartLoader } from "../loaders/cartLoader";
//import { panel_userResolver } from "../services/admin_panel/panel_userResolver";
import { userServices } from "../services/user";
import { CartServices, shopServices } from "../services/shop";
import { adminServices } from "../services/admin_panel";
import { MyContext } from "../types";

export const apolloServerConfig = async (): Promise<ApolloServer> => {
  return new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        CartServices,
        ...userServices,
        ...shopServices,
        ...adminServices,
      ],
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
