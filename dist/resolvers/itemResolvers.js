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
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const entity_1 = require("../entity");
const utils_1 = require("../utils");
const errors_1 = require("../errors");
const types_1 = require("../types");
const validators_1 = require("../utils/validators");
let ItemResolver = class ItemResolver {
    items() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield entity_1.Item.find();
        });
    }
    item(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const uuidError = yield validators_1.UuidValidator({ uuid });
            if (uuidError)
                throw new apollo_server_express_1.ValidationError("Invalid UUID Syntax.");
            const item = yield entity_1.Item.findOne({
                where: { uuid },
                relations: ["category"],
            });
            return item;
        });
    }
    createItem(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const formErrors = yield validators_1.createItemValidator(input);
            if (formErrors)
                return { errors: formErrors };
            const category = yield entity_1.Category.findOne({
                where: { uuid: input.categoryUuid },
            });
            if (!category)
                return {
                    errors: new types_1.NewItemError("NOT_FOUND", "Invalid Category ID.", [
                        "No category",
                    ]),
                };
            return {
                payload: yield entity_1.Item.create(Object.assign({ categoryUuid: input.categoryUuid }, input.fields)).save(),
            };
        });
    }
    updateItem(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const formErrors = yield validators_1.updateItemValidator(input);
            if (formErrors)
                return { errors: formErrors };
            const { uuid, fields } = input;
            const item = yield entity_1.Item.findOne({ where: { uuid } });
            if (!item)
                return {
                    errors: new types_1.UpdateItemErrors("NOT_FOUND", "No Itemf matches this ID.", [
                        "No Item matches this ID.",
                    ]),
                };
            if (fields.categoryUuid) {
                const targetCategory = yield entity_1.Category.findOne({
                    where: { uuid: fields.categoryUuid },
                });
                if (!targetCategory)
                    return {
                        errors: new types_1.UpdateItemErrors("NOT_FOUND", "No Category found for Category ID Field.", undefined, ["Category not found."]),
                    };
            }
            const updatedItem = yield utils_1.updateEntity(entity_1.Item, { uuid }, fields);
            return {
                payload: updatedItem,
            };
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
    type_graphql_1.Query(() => entity_1.Item, { nullable: true }),
    __param(0, type_graphql_1.Arg("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "item", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.CreateItemResponse),
    __param(0, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.newItemInput]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "createItem", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.UpdateItemResponse),
    __param(0, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.updateItemInput]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "updateItem", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.SuccessResponse),
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