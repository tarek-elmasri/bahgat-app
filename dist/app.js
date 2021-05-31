"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const itemResolvers_1 = require("./resolvers/itemResolvers");
const CategoryResolver_1 = require("./resolvers/CategoryResolver");
const UserResolver_1 = require("./resolvers/UserResolver");
const express_session_1 = __importDefault(require("express-session"));
const out_1 = require("connect-typeorm/out");
const Sessions_1 = require("./entity/Sessions");
const CartResolver_1 = require("./resolvers/CartResolver");
const app = express_1.default();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection();
    const sessionRepository = typeorm_1.getConnection().getRepository(Sessions_1.Session);
    app.use(express_session_1.default({
        resave: false,
        saveUninitialized: false,
        store: new out_1.TypeormStore({
            cleanupLimit: 2,
            ttl: 86400,
        }).connect(sessionRepository),
        secret: "keyboard cat",
    }));
    const graphqlServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [itemResolvers_1.ItemResolver, CategoryResolver_1.CategoryResolver, UserResolver_1.UserResolver, CartResolver_1.CartResolver],
            validate: false,
        }),
        debug: false,
        context: ({ req, res }) => ({ req, res }),
    });
    graphqlServer.applyMiddleware({ app });
    const PORT = process.env.PORT || "5000";
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`);
    });
}))();
//# sourceMappingURL=app.js.map