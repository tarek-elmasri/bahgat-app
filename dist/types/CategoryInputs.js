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
exports.DeleteCategoryInput = exports.UpdateCategoryInput = exports.NewCategoryInput = void 0;
const type_graphql_1 = require("type-graphql");
let NewCategoryInput = class NewCategoryInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], NewCategoryInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], NewCategoryInput.prototype, "description", void 0);
NewCategoryInput = __decorate([
    type_graphql_1.InputType()
], NewCategoryInput);
exports.NewCategoryInput = NewCategoryInput;
let UpdateProperties = class UpdateProperties {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateProperties.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateProperties.prototype, "description", void 0);
UpdateProperties = __decorate([
    type_graphql_1.InputType()
], UpdateProperties);
let UpdateCategoryInput = class UpdateCategoryInput {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: false }),
    __metadata("design:type", String)
], UpdateCategoryInput.prototype, "uuid", void 0);
__decorate([
    type_graphql_1.Field(() => UpdateProperties),
    __metadata("design:type", UpdateProperties)
], UpdateCategoryInput.prototype, "fields", void 0);
UpdateCategoryInput = __decorate([
    type_graphql_1.InputType()
], UpdateCategoryInput);
exports.UpdateCategoryInput = UpdateCategoryInput;
let DeleteCategoryInput = class DeleteCategoryInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], DeleteCategoryInput.prototype, "uuid", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: true }),
    __metadata("design:type", Boolean)
], DeleteCategoryInput.prototype, "saveDelete", void 0);
DeleteCategoryInput = __decorate([
    type_graphql_1.InputType()
], DeleteCategoryInput);
exports.DeleteCategoryInput = DeleteCategoryInput;
//# sourceMappingURL=CategoryInputs.js.map