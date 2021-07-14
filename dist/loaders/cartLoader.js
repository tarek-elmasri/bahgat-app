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
exports.cartLoader = exports.batchCarts = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const typeorm_1 = require("typeorm");
const entity_1 = require("../entity");
const batchCarts = (itemIds) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItems = yield entity_1.CartsItems.find({
        join: {
            alias: "cartItem",
            innerJoinAndSelect: {
                item: "cartItem.cart",
            },
        },
        where: {
            itemId: typeorm_1.In(itemIds),
        },
    });
    const itemIdToCart = {};
    cartItems.forEach((ci) => {
        if (ci.cartId in itemIdToCart) {
            itemIdToCart[ci.itemId].push(ci.__cart__);
        }
        else {
            itemIdToCart[ci.itemId] = [ci.__cart__];
        }
    });
    return itemIds.map((itemId) => itemIdToCart[itemId]);
});
exports.batchCarts = batchCarts;
const cartLoader = () => new dataloader_1.default(exports.batchCarts);
exports.cartLoader = cartLoader;
//# sourceMappingURL=cartLoader.js.map