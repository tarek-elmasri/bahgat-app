"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
exports.dbConnection = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: "chocolate",
    synchronize: true,
    logging: true,
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