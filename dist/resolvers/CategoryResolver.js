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
exports.CategoryResolver = void 0;
const Category_1 = require("../entity/Category");
const type_graphql_1 = require("type-graphql");
const CategoryResponse_1 = require("../types/CategoryResponse");
const CategoryInputs_1 = require("../types/CategoryInputs");
const CategoryInputs_2 = require("../types/CategoryInputs");
const CategoryInputs_3 = require("../types/CategoryInputs");
const typeorm_1 = require("typeorm");
const Err_1 = require("../errors/Err");
const codes_1 = require("../errors/codes");
const successResponse_1 = require("../types/successResponse");
let CategoryResolver = class CategoryResolver {
    categories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category_1.Category.find({ relations: ["items"] });
        });
    }
    category(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield Category_1.Category.findOne({
                    where: { uuid },
                    relations: ["items"],
                });
                if (!category)
                    throw new Err_1.Err(codes_1.ErrCode.NOT_FOUND, "No Category matches this ID.");
                return { payload: category };
            }
            catch (err) {
                return Err_1.Err.ResponseBuilder(err);
            }
        });
    }
    createCategory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = Category_1.Category.create(params);
                yield category.save();
                return {
                    payload: category,
                };
            }
            catch (err) {
                return Err_1.Err.ResponseBuilder(err);
            }
        });
    }
    updateCategory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exists = yield Category_1.Category.findOne({ where: { uuid: params.uuid } });
                if (!exists)
                    throw new Err_1.Err(codes_1.ErrCode.NOT_FOUND, "No category matches this ID.");
                yield typeorm_1.getConnection()
                    .getRepository(Category_1.Category)
                    .update({ uuid: params.uuid }, params.properties);
                const category = yield Category_1.Category.findOne({ where: { uuid: params.uuid } });
                return {
                    payload: category,
                };
            }
            catch (err) {
                return Err_1.Err.ResponseBuilder(err);
            }
        });
    }
    deleteCategory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (params.saveDelete) {
                }
                const result = yield typeorm_1.getConnection()
                    .getRepository(Category_1.Category)
                    .delete({ uuid: params.uuid });
                if (result.affected < 1)
                    throw new Err_1.Err(codes_1.ErrCode.NOT_FOUND, "No category matched this ID.");
                return { ok: true };
            }
            catch (err) {
                return Err_1.Err.ResponseBuilder(err);
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Category_1.Category]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "categories", null);
__decorate([
    type_graphql_1.Query(() => CategoryResponse_1.CategoryResponse),
    __param(0, type_graphql_1.Arg("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "category", null);
__decorate([
    type_graphql_1.Mutation(() => CategoryResponse_1.CategoryResponse),
    __param(0, type_graphql_1.Arg("properties")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryInputs_1.NewCategoryInput]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "createCategory", null);
__decorate([
    type_graphql_1.Mutation(() => CategoryResponse_1.CategoryResponse),
    __param(0, type_graphql_1.Arg("properties")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryInputs_2.UpdateCategoryInput]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "updateCategory", null);
__decorate([
    type_graphql_1.Mutation(() => successResponse_1.SuccessResponse),
    __param(0, type_graphql_1.Arg("properties")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryInputs_3.DeleteCategoryInput]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "deleteCategory", null);
CategoryResolver = __decorate([
    type_graphql_1.Resolver()
], CategoryResolver);
exports.CategoryResolver = CategoryResolver;
//# sourceMappingURL=CategoryResolver.js.map