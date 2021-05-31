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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartResponse = void 0;
const Cart_1 = require("../entity/Cart");
const type_graphql_1 = require("type-graphql");
const MyError_1 = require("./MyError");
let CartResponse = class CartResponse {
};
__decorate([
    type_graphql_1.Field(() => Cart_1.Cart, { nullable: true }),
    __metadata("design:type", Cart_1.Cart)
], CartResponse.prototype, "payload", void 0);
__decorate([
    type_graphql_1.Field(() => [MyError_1.MyError], { nullable: true }),
    __metadata("design:type", Array)
], CartResponse.prototype, "errors", void 0);
CartResponse = __decorate([
    type_graphql_1.ObjectType()
], CartResponse);
exports.CartResponse = CartResponse;
//# sourceMappingURL=CartResponse.js.map