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
const Cart_1 = require("../entity/Cart");
const Role_1 = require("../types/Role");
const sessionBuilder = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartUuid, role, id, userUuid } = req.session;
    if (!cartUuid && !userUuid) {
        const cart = yield Cart_1.Cart.create({
            sessionId: id,
        }).save();
        req.session.cartUuid = cart.uuid;
    }
    if (!role && !userUuid) {
        req.session.role = Role_1.Role.GUEST;
    }
    next();
});
exports.default = sessionBuilder;
//# sourceMappingURL=sessionBuilder.js.map