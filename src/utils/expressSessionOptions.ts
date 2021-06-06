import { TypeormStore } from "connect-typeorm/out";
import { SessionOptions } from "express-session";
import { Session } from "../entity";
import { getConnection } from "typeorm";

export const expressSessionConfig = (): SessionOptions => {
  const sessionRepository = getConnection().getRepository(Session);

  const expressSessionOptions: SessionOptions = {
    name: "sid",
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
  };

  return expressSessionOptions;
};

export default expressSessionConfig;
