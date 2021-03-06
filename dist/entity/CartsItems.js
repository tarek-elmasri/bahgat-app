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
exports.CartsItems = void 0;
const validators_1 = require("../utils/validators");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const _1 = require("./");
const errors_1 = require("../errors");
let CartsItems = class CartsItems extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.errors = {};
        this.inputErrors = undefined;
        this.getErrors = (errorClass) => {
            if (this.inputErrors)
                return Object.assign(errorClass ? new errorClass() : new errors_1.OnError(), this.errors);
            return undefined;
        };
    }
    validateInput(schema) {
        return __awaiter(this, void 0, void 0, function* () {
            this.inputErrors = yield validators_1.myValidator(schema, this);
            this.errors = Object.assign(this.errors, this.inputErrors);
            return this;
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], CartsItems.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CartsItems.prototype, "cartId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CartsItems.prototype, "itemId", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.Column("int"),
    __metadata("design:type", Number)
], CartsItems.prototype, "quantity", void 0);
__decorate([
    type_graphql_1.Field(() => _1.Item),
    typeorm_1.ManyToOne(() => _1.Item, (item) => item.cartConnection, { primary: true }),
    typeorm_1.JoinTable({ name: "itemId" }),
    __metadata("design:type", Promise)
], CartsItems.prototype, "item", void 0);
__decorate([
    typeorm_1.ManyToOne(() => _1.Cart, (cart) => cart.cartItems, { primary: true }),
    typeorm_1.JoinTable({ name: "cartId" }),
    __metadata("design:type", Promise)
], CartsItems.prototype, "cart", void 0);
CartsItems = __decorate([
    typeorm_1.Entity("cartsitems"),
    type_graphql_1.ObjectType()
], CartsItems);
exports.CartsItems = CartsItems;
//# sourceMappingURL=CartsItems.js.map