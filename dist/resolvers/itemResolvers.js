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
exports.ItemResolver = void 0;
const type_graphql_1 = require("type-graphql");
const entity_1 = require("../entity");
const errors_1 = require("../errors");
const typeorm_1 = require("typeorm");
const types_1 = require("../types");
const middlewares_1 = require("../middlewares");
const myValidator_1 = require("../utils/validators/myValidator");
let ItemResolver = class ItemResolver {
    items() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield entity_1.Item.find({ relations: ["category"] });
        });
    }
    item(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield entity_1.Item.findOne({
                    where: { uuid },
                    relations: ["category"],
                });
                if (!item)
                    throw new errors_1.Err(errors_1.ErrCode.NOT_FOUND, "No Item matches this ID.");
                return {
                    payload: item,
                };
            }
            catch (err) {
                return errors_1.Err.ResponseBuilder(err);
            }
        });
    }
    createItem({ categoryUuid, fields }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formErrors = yield myValidator_1.myValidator(fields, myValidator_1.createItemRules);
                if (formErrors)
                    return { errors: formErrors };
                const category = yield entity_1.Category.findOne({
                    where: { uuid: categoryUuid },
                });
                if (!category)
                    throw new errors_1.Err(errors_1.ErrCode.NOT_FOUND, "No Category matches this Category ID.");
                return {
                    payload: yield entity_1.Item.create(Object.assign(Object.assign({}, fields), { categoryUuid })).save(),
                };
            }
            catch (err) {
                return errors_1.Err.ResponseBuilder(err);
            }
        });
    }
    updateItem({ uuid, fields }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield entity_1.Item.findOne({ where: { uuid } });
                if (!item)
                    throw new errors_1.Err(errors_1.ErrCode.NOT_FOUND, "No Item Matches this ID.");
                const formInput = { name: fields.name || item.name };
                const formErrors = yield myValidator_1.myValidator(formInput, myValidator_1.createItemRules);
                if (formErrors)
                    return { errors: formErrors };
                yield typeorm_1.getConnection().getRepository(entity_1.Item).update({ uuid }, fields);
                const updated = yield entity_1.Item.findOne({
                    where: { uuid },
                    relations: ["category"],
                });
                return {
                    payload: updated,
                };
            }
            catch (err) {
                return errors_1.Err.ResponseBuilder(err);
            }
        });
    }
    deleteItem(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield entity_1.Item.delete({ uuid });
                if (deleted.affected < 1)
                    throw new errors_1.Err(errors_1.ErrCode.NOT_FOUND, "No Result matches this ID.");
                return {
                    ok: true,
                };
            }
            catch (err) {
                return errors_1.Err.ResponseBuilder(err);
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [entity_1.Item]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "items", null);
__decorate([
    type_graphql_1.Query(() => types_1.PayloadResponse, { nullable: true }),
    __param(0, type_graphql_1.Arg("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "item", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.PayloadResponse),
    type_graphql_1.UseMiddleware(middlewares_1.isAuthorized(["addItem"])),
    __param(0, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.newItemInput]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "createItem", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.PayloadResponse),
    type_graphql_1.UseMiddleware(middlewares_1.isAuthorized(["updateItem"])),
    __param(0, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.updateItemInput]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "updateItem", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.SuccessResponse),
    type_graphql_1.UseMiddleware(middlewares_1.isAuthorized(["deleteItem"])),
    __param(0, type_graphql_1.Arg("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "deleteItem", null);
ItemResolver = __decorate([
    type_graphql_1.Resolver()
], ItemResolver);
exports.ItemResolver = ItemResolver;
//# sourceMappingURL=itemResolvers.js.map