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
let newItemFields = class newItemFields {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], newItemFields.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], newItemFields.prototype, "img", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], newItemFields.prototype, "price", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], newItemFields.prototype, "stock", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], newItemFields.prototype, "infiniteStock", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], newItemFields.prototype, "notifyLowStock", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], newItemFields.prototype, "notifyStockOfQuantity", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], newItemFields.prototype, "patchNo", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], newItemFields.prototype, "weight", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], newItemFields.prototype, "costValue", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], newItemFields.prototype, "discountPrice", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], newItemFields.prototype, "haveDiscount", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], newItemFields.prototype, "quantityLimitOnDiscount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], newItemFields.prototype, "maxQuantityOnDiscount", void 0);
__decorate([
    type_graphql_1.Field(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], newItemFields.prototype, "discountEndDate", void 0);
newItemFields = __decorate([
    type_graphql_1.InputType()
], newItemFields);
let newItemInput = class newItemInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], newItemInput.prototype, "categoryId", void 0);
__decorate([
    type_graphql_1.Field(() => newItemFields),
    __metadata("design:type", newItemFields)
], newItemInput.prototype, "fields", void 0);
newItemInput = __decorate([
    type_graphql_1.InputType()
], newItemInput);
exports.newItemInput = newItemInput;
let updateItemFields = class updateItemFields {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], updateItemFields.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], updateItemFields.prototype, "categoryId", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], updateItemFields.prototype, "img", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], updateItemFields.prototype, "price", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], updateItemFields.prototype, "stock", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], updateItemFields.prototype, "infiniteStock", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], updateItemFields.prototype, "notifyLowStock", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], updateItemFields.prototype, "notifyStockOfQuantity", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], updateItemFields.prototype, "patchNo", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], updateItemFields.prototype, "weight", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], updateItemFields.prototype, "costValue", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], updateItemFields.prototype, "discountPrice", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], updateItemFields.prototype, "haveDiscount", void 0);
__decorate([
    type_graphql_1.Field({ defaultValue: false }),
    __metadata("design:type", Boolean)
], updateItemFields.prototype, "quantityLimitOnDiscount", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], updateItemFields.prototype, "maxQuantityOnDiscount", void 0);
__decorate([
    type_graphql_1.Field(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], updateItemFields.prototype, "discountEndDate", void 0);
updateItemFields = __decorate([
    type_graphql_1.InputType()
], updateItemFields);
let updateItemInput = class updateItemInput {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], updateItemInput.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => updateItemFields),
    __metadata("design:type", updateItemFields)
], updateItemInput.prototype, "fields", void 0);
updateItemInput = __decorate([
    type_graphql_1.InputType()
], updateItemInput);
exports.updateItemInput = updateItemInput;
//# sourceMappingURL=ItemInputs.js.map