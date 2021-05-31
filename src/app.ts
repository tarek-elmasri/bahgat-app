import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createConnection, getConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import { ItemResolver } from "./resolvers/itemResolvers";
import { CategoryResolver } from "./resolvers/CategoryResolver";
import { MyContext } from "./types/MyContext";
import { UserResolver } from "./resolvers/UserResolver";
import expressSession from "express-session";
import { TypeormStore } from "connect-typeorm/out";
import { Session } from "./entity/Sessions";
import { CartResolver } from "./resolvers/CartResolver";

declare module "express-session" {
  interface SessionData {
    userUuid?: string;
    cartUuid?: string;
  }
}

const app = express();

(async () => {
  await createConnection();

  const sessionRepository = getConnection().getRepository(Session);

  app.use(
    expressSession({
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({
        cleanupLimit: 2,
        //limitSubquery: false, // If using MariaDB.
        ttl: 86400,
      }).connect(sessionRepository),
      secret: "keyboard cat",
    })
  );

  const graphqlServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ItemResolver, CategoryResolver, UserResolver, CartResolver],
      validate: false,
    }),
    debug: false,
    context: ({ req, res }): MyContext => ({ req, res }),
  });

  graphqlServer.applyMiddleware({ app });

  const PORT: string = process.env.PORT || "5000";
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
})();
