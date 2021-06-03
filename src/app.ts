import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createConnection, getConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import { ItemResolver } from "./resolvers/itemResolvers";
import { CategoryResolver } from "./resolvers/CategoryResolver";
import { UserResolver } from "./resolvers/UserResolver";
import expressSession from "express-session";
import { TypeormStore } from "connect-typeorm/out";
import { Session } from "./entity/Sessions";
import { CartResolver } from "./resolvers/CartResolver";
import { itemLoader } from "./loaders/ItemLoader";
import { cartLoader } from "./loaders/cartLoader";
import sessionBuilder from "./utils/sessionBuilder";
import dbConnection from "./utils/dbConnection";
import { Role, MyContext } from "./types";

declare module "express-session" {
  interface SessionData {
    userUuid?: string;
    cartUuid?: string;
    role?: Role;
  }
}

const app = express();

(async () => {
  await createConnection(dbConnection);

  const sessionRepository = getConnection().getRepository(Session);

  app.use(
    expressSession({
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({
        cleanupLimit: 2,
        limitSubquery: true, // If using MariaDB.
        cookie: {
          sameSite: "lax",
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7 * 30 * 10,
        },
        ttl: 846000,
      }).connect(sessionRepository),
      secret: "keyboard cat",
    })
  );

  //middleware to build session parameters
  app.use(sessionBuilder);

  const graphqlServer = new ApolloServer({
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

  graphqlServer.applyMiddleware({ app });

  const PORT: string = process.env.PORT || "5000";
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
})();
