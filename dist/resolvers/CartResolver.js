"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.CartResolver = void 0;
const types_1 = require("../types");
const type_graphql_1 = require("type-graphql");
const errors_1 = require("../errors");
const entity_1 = require("../entity");
let CartResolver = class CartResolver {
    myCart({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return {
                    payload: yield entity_1.Cart.findOne({
                        where: { uuid: req.session.cartUuid },
                    }),
                };
            }
            catch (err) {
                return errors_1.Err.ResponseBuilder(err);
            }
        });
    }
    addItemToCart(itemUuid, quantity, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield entity_1.Item.findOne({ where: { uuid: itemUuid } });
                if (!item)
                    throw new errors_1.Err(errors_1.ErrCode.NOT_FOUND, "No Item found for this ID.");
                yield entity_1.CartsItems.create({
                    cartUuid: req.session.cartUuid,
                    itemUuid,
                    quantity,
                }).save();
                return { payload: item };
            }
            catch (err) {
                return errors_1.Err.ResponseBuilder(err);
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => types_1.PayloadResponse),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "myCart", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.PayloadResponse),
    __param(0, type_graphql_1.Arg("itemUuid")),
    __param(1, type_graphql_1.Arg("quantity")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "addItemToCart", null);
CartResolver = __decorate([
    type_graphql_1.Resolver()
], CartResolver);
exports.CartResolver = CartResolver;
//# sourceMappingURL=CartResolver.js.map