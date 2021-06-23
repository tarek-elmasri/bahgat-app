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
const sessionBuilder_1 = require("../middlewares/sessionBuilder");
const syncCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { session, user } = req;
    const userCart = yield entity_1.Cart.findOne({
        where: { userUuid: user.uuid },
    });
    yield typeorm_1.getConnection()
        .getRepository(entity_1.CartsItems)
        .createQueryBuilder()
        .update()
        .set({ cartUuid: userCart.uuid })
        .where(`cartUuid = :cartUuid`, { cartUuid: session.cartUuid })
        .execute();
    yield typeorm_1.getConnection()
        .createQueryBuilder()
        .delete()
        .from(entity_1.Cart)
        .where("uuid = :uuid", { uuid: session.cartUuid })
        .execute();
    session.cartUuid = userCart.uuid;
    yield sessionBuilder_1.updateSession(session, user, req, res);
});
exports.syncCart = syncCart;
//# sourceMappingURL=syncCart.js.map