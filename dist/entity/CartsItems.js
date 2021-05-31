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
exports.CartsItems = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Cart_1 = require("./Cart");
const Item_1 = require("./Item");
let CartsItems = class CartsItems extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], CartsItems.prototype, "uuid", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], CartsItems.prototype, "cartUuid", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], CartsItems.prototype, "itemUuid", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.Column("int"),
    __metadata("design:type", Number)
], CartsItems.prototype, "quantity", void 0);
__decorate([
    type_graphql_1.Field(() => Item_1.Item),
    typeorm_1.ManyToOne(() => Item_1.Item, (item) => item.cartItems, { nullable: true }),
    __metadata("design:type", Item_1.Item)
], CartsItems.prototype, "item", void 0);
__decorate([
    type_graphql_1.Field(() => Cart_1.Cart),
    typeorm_1.ManyToOne(() => Cart_1.Cart, (cart) => cart.cartItems, { nullable: true }),
    __metadata("design:type", Cart_1.Cart)
], CartsItems.prototype, "card", void 0);
CartsItems = __decorate([
    typeorm_1.Entity("cartsitems"),
    type_graphql_1.ObjectType()
], CartsItems);
exports.CartsItems = CartsItems;
//# sourceMappingURL=CartsItems.js.map