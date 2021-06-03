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
exports.itemLoader = exports.batchItems = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const typeorm_1 = require("typeorm");
const CartsItems_1 = require("../entity/CartsItems");
const batchItems = (cartIds) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItems = yield CartsItems_1.CartsItems.find({
        join: {
            alias: "cartItem",
            innerJoinAndSelect: {
                item: "cartItem.item",
            },
        },
        where: {
            cartUuid: typeorm_1.In(cartIds),
        },
    });
    const cartIdToItem = {};
    cartItems.forEach((ci) => {
        if (ci.cartUuid in cartIdToItem) {
            cartIdToItem[ci.cartUuid].push(ci.__item__);
        }
        else {
            cartIdToItem[ci.cartUuid] = [ci.__item__];
        }
    });
    return cartIds.map((cartUuid) => cartIdToItem[cartUuid]);
});
exports.batchItems = batchItems;
const itemLoader = () => new dataloader_1.default(exports.batchItems);
exports.itemLoader = itemLoader;
//# sourceMappingURL=ItemLoader.js.map