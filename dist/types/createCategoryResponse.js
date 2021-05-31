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
exports.CategoryResponse = void 0;
const Category_1 = require("../entity/Category");
const type_graphql_1 = require("type-graphql");
const MyError_1 = require("./MyError");
let CategoryResponse = class CategoryResponse {
};
__decorate([
    type_graphql_1.Field(() => Category_1.Category, { nullable: true }),
    __metadata("design:type", Category_1.Category)
], CategoryResponse.prototype, "category", void 0);
__decorate([
    type_graphql_1.Field(() => [MyError_1.MyError], { nullable: true }),
    __metadata("design:type", Array)
], CategoryResponse.prototype, "errors", void 0);
CategoryResponse = __decorate([
    type_graphql_1.ObjectType()
], CategoryResponse);
exports.CategoryResponse = CategoryResponse;
//# sourceMappingURL=createCategoryResponse.js.map