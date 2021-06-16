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
exports.isGuest = exports.isAdmin = exports.isStaff = void 0;
const types_1 = require("../types");
const Err_1 = require("../errors/Err");
const codes_1 = require("../errors/codes");
const isAuthorized = ({ req }, next, key) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const role = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || types_1.Role.GUEST;
    let pass = false;
    if (key === types_1.Role.STAFF) {
        pass = role === types_1.Role.STAFF || role === types_1.Role.ADMIN;
    }
    else {
        pass = role === key;
    }
    if (!pass) {
        throw new Err_1.Err(codes_1.ErrCode.NOT_AUTHORIZED, "The request is unauthorized.");
    }
    return next();
});
const isStaff = ({ context }, next) => isAuthorized(context, next, types_1.Role.STAFF);
exports.isStaff = isStaff;
const isAdmin = ({ context }, next) => isAuthorized(context, next, types_1.Role.ADMIN);
exports.isAdmin = isAdmin;
const isGuest = ({ context }, next) => isAuthorized(context, next, types_1.Role.GUEST);
exports.isGuest = isGuest;
//# sourceMappingURL=authorization.js.map