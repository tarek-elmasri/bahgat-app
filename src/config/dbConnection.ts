import {
  DATABASE_PASSWORD,
  DATABASE_USERNAME,
  __producation__,
} from "../types";
import { ConnectionOptions } from "typeorm";

export const dbConnection: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: "shopping_app",
  synchronize: !__producation__,
  logging: !__producation__,
  entities: ["dist/entity/**/*.js"],
  migrations: ["dist/migration/**/*.js"],
  subscribers: ["dist/subscriber/**/*.js"],
  cli: {
    entitiesDir: "dist/entity",
    migrationsDir: "dist/migration",
    subscribersDir: "dist/subscriber",
  },
};
