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
exports.updateItemInput = exports.newItemInput = void 0;
const type_graphql_1 = require("type-graphql");
let newItemInput = class newItemInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], newItemInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], newItemInput.prototype, "img", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], newItemInput.prototype, "price", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], newItemInput.prototype, "stock", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], newItemInput.prototype, "infiniteStock", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], newItemInput.prototype, "notifyLowStock", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], newItemInput.prototype, "notifyStockOfQuantity", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], newItemInput.prototype, "patchNo", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], newItemInput.prototype, "weight", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], newItemInput.prototype, "costValue", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], newItemInput.prototype, "discountPrice", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], newItemInput.prototype, "haveDiscount", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], newItemInput.prototype, "quantityLimitOnDiscount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], newItemInput.prototype, "maxQuantityOnDiscount", void 0);
__decorate([
    type_graphql_1.Field(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], newItemInput.prototype, "discountEndDate", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], newItemInput.prototype, "categoryUuid", void 0);
newItemInput = __decorate([
    type_graphql_1.InputType()
], newItemInput);
exports.newItemInput = newItemInput;
let InputUpdateProperties = class InputUpdateProperties {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], InputUpdateProperties.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], InputUpdateProperties.prototype, "img", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], InputUpdateProperties.prototype, "price", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], InputUpdateProperties.prototype, "stock", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], InputUpdateProperties.prototype, "infiniteStock", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], InputUpdateProperties.prototype, "notifyLowStock", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], InputUpdateProperties.prototype, "notifyStockOfQuantity", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], InputUpdateProperties.prototype, "patchNo", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], InputUpdateProperties.prototype, "weight", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], InputUpdateProperties.prototype, "costValue", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], InputUpdateProperties.prototype, "discountPrice", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], InputUpdateProperties.prototype, "haveDiscount", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], InputUpdateProperties.prototype, "quantityLimitOnDiscount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], InputUpdateProperties.prototype, "maxQuantityOnDiscount", void 0);
__decorate([
    type_graphql_1.Field(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], InputUpdateProperties.prototype, "discountEndDate", void 0);
InputUpdateProperties = __decorate([
    type_graphql_1.InputType()
], InputUpdateProperties);
let updateItemInput = class updateItemInput {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], updateItemInput.prototype, "uuid", void 0);
__decorate([
    type_graphql_1.Field(() => InputUpdateProperties),
    __metadata("design:type", InputUpdateProperties)
], updateItemInput.prototype, "properties", void 0);
updateItemInput = __decorate([
    type_graphql_1.InputType()
], updateItemInput);
exports.updateItemInput = updateItemInput;
//# sourceMappingURL=ItemInputs.js.map