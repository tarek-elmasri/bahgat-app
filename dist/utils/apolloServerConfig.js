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
Object.defineProperty(exports, "__esModule", { value: true });
exports.apolloServerConfig = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const resolvers_1 = require("../resolvers");
const type_graphql_1 = require("type-graphql");
const ItemLoader_1 = require("../loaders/ItemLoader");
const cartLoader_1 = require("../loaders/cartLoader");
const panel_userResolver_1 = require("../resolvers/admin_panel/panel_userResolver");
const apolloServerConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    return new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [
                resolvers_1.ItemResolver,
                resolvers_1.CategoryResolver,
                resolvers_1.UserResolver,
                resolvers_1.CartResolver,
                panel_userResolver_1.panel_userResolver,
            ],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            itemsLoader: ItemLoader_1.itemLoader(),
            cartsLoader: cartLoader_1.cartLoader(),
        }),
    });
});
exports.apolloServerConfig = apolloServerConfig;
//# sourceMappingURL=apolloServerConfig.js.map