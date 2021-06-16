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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const typeorm_1 = require("typeorm");
const utils_1 = require("./utils");
const app = express_1.default();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection(utils_1.dbConnection);
    app.use(cookie_parser_1.default());
    app.use(utils_1.sessionBuilder);
    const graphqlServer = yield utils_1.apolloServerConfig();
    graphqlServer.applyMiddleware({ app });
    const PORT = process.env.PORT || "5000";
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`);
    });
}))();
//# sourceMappingURL=app.js.map