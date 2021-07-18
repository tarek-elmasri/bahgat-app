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
exports.CurrentUser = exports.isGuest = exports.isAuthorized = void 0;
const types_1 = require("../types");
const type_graphql_1 = require("type-graphql");
const Errors_1 = require("../errors/Errors");
const apollo_server_express_1 = require("apollo-server-express");
function isAuthorized(keys) {
    return type_graphql_1.createMethodDecorator(({ context }, next) => __awaiter(this, void 0, void 0, function* () {
        const { user } = context.req;
        const role = (user === null || user === void 0 ? void 0 : user.role) || types_1.Role.GUEST;
        if (role === types_1.Role.ADMIN)
            return next();
        if (role === types_1.Role.GUEST || !(user === null || user === void 0 ? void 0 : user.authorization))
            throw new apollo_server_express_1.ForbiddenError("Access denied! You need to be authorized to perform this action!");
        let reqAuth = Object.assign({}, user.authorization);
        keys.map((key) => {
            if (!reqAuth[key])
                throw new apollo_server_express_1.ForbiddenError("Access denied! You need to be authorized to perform this action!");
        });
        return next();
    }));
}
exports.isAuthorized = isAuthorized;
function isGuest() {
    return type_graphql_1.createMethodDecorator(({ context }, next) => __awaiter(this, void 0, void 0, function* () {
        if (context.req.user)
            throw new Errors_1.BadRequestError("User already logged in.");
        return next();
    }));
}
exports.isGuest = isGuest;
function CurrentUser() {
    return type_graphql_1.createMethodDecorator(({ context }, next) => __awaiter(this, void 0, void 0, function* () {
        if (!context.req.user)
            throw new apollo_server_express_1.AuthenticationError("Access denied! You need to be logged in to perform this action!");
        return next();
    }));
}
exports.CurrentUser = CurrentUser;
//# sourceMappingURL=authorization.js.map