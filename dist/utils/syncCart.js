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
exports.syncCart = void 0;
const typeorm_1 = require("typeorm");
const entity_1 = require("../entity");
const errors_1 = require("../errors");
const syncCart = (user, session) => __awaiter(void 0, void 0, void 0, function* () {
    const userCart = yield entity_1.Cart.findOne({
        where: { userId: user.id },
    });
    if (!userCart)
        throw new errors_1.Err(errors_1.ErrCode.NOT_FOUND, "no cart found for this user, .. internal error");
    yield typeorm_1.getConnection()
        .getRepository(entity_1.CartsItems)
        .createQueryBuilder()
        .update()
        .set({ cartId: userCart.id })
        .where(`cartId = :cartId`, { cartId: session.cartId })
        .execute();
    yield typeorm_1.getConnection()
        .createQueryBuilder()
        .delete()
        .from(entity_1.Cart)
        .where("id = :id", { id: session.cartId })
        .execute();
    return userCart;
});
exports.syncCart = syncCart;
//# sourceMappingURL=syncCart.js.map