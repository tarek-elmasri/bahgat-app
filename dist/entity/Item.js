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
exports.Item = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const CartsItems_1 = require("./CartsItems");
const Category_1 = require("./Category");
let Item = class Item extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Item.prototype, "uuid", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("varchar"),
    __metadata("design:type", String)
], Item.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "img", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("float"),
    __metadata("design:type", Number)
], Item.prototype, "price", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.Column("int"),
    __metadata("design:type", Number)
], Item.prototype, "stock", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    typeorm_1.Column("boolean", { default: false }),
    __metadata("design:type", Boolean)
], Item.prototype, "infiniteStock", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("boolean", { default: false }),
    __metadata("design:type", Boolean)
], Item.prototype, "notifyLowStock", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    typeorm_1.Column("int", { nullable: true }),
    __metadata("design:type", Number)
], Item.prototype, "notifyStockOfQuantity", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "patchNo", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    typeorm_1.Column("varchar", { nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "weight", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    typeorm_1.Column("float", { nullable: true }),
    __metadata("design:type", Number)
], Item.prototype, "costValue", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    typeorm_1.Column("float", { nullable: true }),
    __metadata("design:type", Number)
], Item.prototype, "discountPrice", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    typeorm_1.Column("boolean", { default: false }),
    __metadata("design:type", Boolean)
], Item.prototype, "haveDiscount", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    typeorm_1.Column("boolean", { default: false }),
    __metadata("design:type", Boolean)
], Item.prototype, "quantityLimitOnDiscount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    typeorm_1.Column("int", { nullable: true }),
    __metadata("design:type", Number)
], Item.prototype, "maxQuantityOnDiscount", void 0);
__decorate([
    type_graphql_1.Field(() => Date, { nullable: true }),
    typeorm_1.Column("timestamp", { nullable: true }),
    __metadata("design:type", Date)
], Item.prototype, "discountEndDate", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Item.prototype, "categoryUuid", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Item.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Item.prototype, "updatedAt", void 0);
__decorate([
    type_graphql_1.Field(() => Category_1.Category),
    typeorm_1.ManyToOne(() => Category_1.Category, (category) => category.items, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Category_1.Category)
], Item.prototype, "category", void 0);
__decorate([
    type_graphql_1.Field(() => [CartsItems_1.CartsItems], { nullable: true }),
    typeorm_1.OneToMany(() => CartsItems_1.CartsItems, (cartItem) => cartItem.item),
    __metadata("design:type", Array)
], Item.prototype, "cartItems", void 0);
Item = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity("items")
], Item);
exports.Item = Item;
//# sourceMappingURL=Item.js.map