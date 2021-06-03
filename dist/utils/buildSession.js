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
exports.createNewCart = void 0;
const Cart_1 = require("../entity/Cart");
const createNewCart = (sessionId, userUuid, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCart = Cart_1.Cart.create({ sessionId, userUuid });
        return yield newCart.save();
    }
    catch (err) {
        console.log(err);
        return undefined;
    }
});
exports.createNewCart = createNewCart;
//# sourceMappingURL=buildSession.js.map