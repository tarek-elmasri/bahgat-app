import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { createConnection } from "typeorm";
import { apolloServerConfig, dbConnection } from "./config";
import { sessionBuilder } from "./middlewares";

const app = express();

(async () => {
  await createConnection(dbConnection);
  //use cookies middleware
  app.use(cookieParser());
  //middleware to build session parameters
  app.use(sessionBuilder);

  const graphqlServer = await apolloServerConfig();

  graphqlServer.applyMiddleware({ app });

  const PORT: string = process.env.PORT || "5000";
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
})();
