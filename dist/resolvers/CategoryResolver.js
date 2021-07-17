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
const middlewares_1 = require("../middlewares");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const entity_1 = require("../entity");
const errors_1 = require("../errors");
const types_1 = require("../types");
const validators_1 = require("../utils/validators");
let CategoryResolver = class CategoryResolver {
    categories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield entity_1.Category.find();
        });
    }
    category(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const formErrors = (yield entity_1.Category.create({ id }).validateInput(validators_1.uuidSchema)).getErrors(errors_1.InvalidUuidSyntaxError);
            if (formErrors)
                return undefined;
            return entity_1.Category.findOne({
                where: { id },
            });
        });
    }
    createCategory(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCategory = entity_1.Category.create(input);
            yield newCategory.validateInput(validators_1.newCategorySchema);
            const formErrors = newCategory.getErrors(types_1.CreateCategoryErrors);
            if (formErrors)
                return { errors: formErrors };
            return { payload: yield newCategory.save() };
        });
    }
    updateCategory(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetCategory = entity_1.Category.create(Object.assign({ id: input.id }, input.fields));
            yield targetCategory.validateInput(validators_1.updateCategorySchema);
            const formErrors = targetCategory.getErrors(types_1.UpdateCategoryErrors);
            if (formErrors)
                return { errors: formErrors };
            const category = yield entity_1.Category.preload(targetCategory);
            if (!category)
                return {
                    errors: new types_1.UpdateCategoryErrors("NOT_FOUND", "No Category matches this ID.", ["No Category matches this ID."]),
                };
            return { payload: yield category.save() };
        });
    }
    deleteCategory({ id, saveDelete }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (saveDelete) {
                }
                const result = yield typeorm_1.getConnection()
                    .getRepository(entity_1.Category)
                    .delete({ id });
                if (result.affected < 1)
                    throw new errors_1.Err(errors_1.ErrCode.NOT_FOUND, "No category matched this ID.");
                return { ok: true };
            }
            catch (err) {
                return errors_1.Err.ResponseBuilder(err);
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [entity_1.Category]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "categories", null);
__decorate([
    type_graphql_1.Query(() => entity_1.Category, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "category", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.CreateCategoryResponse),
    middlewares_1.isAuthorized(["addCategory"]),
    __param(0, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.NewCategoryInput]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "createCategory", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.UpdateCategoryResponse),
    middlewares_1.isAuthorized(["updateCategory"]),
    __param(0, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UpdateCategoryInput]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "updateCategory", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.SuccessResponse),
    middlewares_1.isAuthorized(["deleteCategory"]),
    __param(0, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.DeleteCategoryInput]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "deleteCategory", null);
CategoryResolver = __decorate([
    type_graphql_1.Resolver()
], CategoryResolver);
exports.CategoryResolver = CategoryResolver;
//# sourceMappingURL=CategoryResolver.js.map