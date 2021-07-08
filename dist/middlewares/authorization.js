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
exports.isGuest = exports.isAuthorized = void 0;
const types_1 = require("../types");
const errors_1 = require("../errors");
const Errors_1 = require("../errors/Errors");
const isAuthorized = (keys) => ({ context }, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = context.req;
    const role = (user === null || user === void 0 ? void 0 : user.role) || types_1.Role.GUEST;
    if (role === types_1.Role.ADMIN)
        return next();
    if (role === types_1.Role.GUEST || !(user === null || user === void 0 ? void 0 : user.authorization))
        throw new Errors_1.UnAuthorizedError("Unauthorized Request");
    let reqAuth = Object.assign({}, user.authorization);
    keys.map((key) => {
        if (!reqAuth[key])
            throw new Errors_1.UnAuthorizedError("Unauthorized Request");
    });
    return next();
});
exports.isAuthorized = isAuthorized;
const isGuest = ({ context }, next) => {
    if (context.req.user)
        throw new errors_1.Err(errors_1.ErrCode.INVALID_ACTION, "User already logged in.");
    return next();
};
exports.isGuest = isGuest;
//# sourceMappingURL=authorization.js.map