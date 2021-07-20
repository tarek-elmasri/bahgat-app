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
exports.Category = void 0;
const validators_1 = require("../utils/validators");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const _1 = require("./");
const errors_1 = require("../errors");
let Category = class Category extends typeorm_1.BaseEntity {
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
            this.inputErrors = yield validators_1.myValidator(schema, {
                id: this.id,
                name: this.name,
                description: this.description,
            });
            this.errors = Object.assign(this.errors, this.inputErrors);
            console.log("input errors: ", this.inputErrors);
            console.log("errors", this.errors);
            return this;
        });
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("varchar", { nullable: false }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Category.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => Date, { nullable: true }),
    typeorm_1.UpdateDateColumn({ nullable: true }),
    __metadata("design:type", Date)
], Category.prototype, "updatedAt", void 0);
__decorate([
    type_graphql_1.Field(() => [_1.Item], { nullable: true }),
    typeorm_1.OneToMany(() => _1.Item, (item) => item.category, { eager: true }),
    __metadata("design:type", Array)
], Category.prototype, "items", void 0);
Category = __decorate([
    typeorm_1.Entity("categories"),
    type_graphql_1.ObjectType()
], Category);
exports.Category = Category;
//# sourceMappingURL=Category.js.map