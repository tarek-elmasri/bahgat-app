"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const types_1 = require("../types");
exports.dbConnection = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: "chocolate",
    synchronize: !types_1.__producation__,
    logging: !types_1.__producation__,
    entities: ["dist/entity/**/*.js"],
    migrations: ["dist/migration/**/*.js"],
    subscribers: ["dist/subscriber/**/*.js"],
    cli: {
        entitiesDir: "dist/entity",
        migrationsDir: "dist/migration",
        subscribersDir: "dist/subscriber",
    },
};
//# sourceMappingURL=dbConnection.js.map