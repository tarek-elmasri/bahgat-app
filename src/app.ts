import "reflect-metadata";
import "dotenv/config";
import "./types/SessionData";
import express from "express";
import { createConnection } from "typeorm";
import expressSession from "express-session";
import {
  sessionBuilder,
  expressSessionConfig,
  apolloServerConfig,
  dbConnection,
} from "./utils";

const app = express();

(async () => {
  await createConnection(dbConnection);

  app.use(expressSession(expressSessionConfig()));

  //middleware to build session parameters
  app.use(sessionBuilder);

  const graphqlServer = await apolloServerConfig();

  graphqlServer.applyMiddleware({ app });

  const PORT: string = process.env.PORT || "5000";
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
})();
