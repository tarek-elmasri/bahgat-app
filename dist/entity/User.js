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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const types_1 = require("../types");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const _1 = require("./");
const middlewares_1 = require("../middlewares");
const validators_1 = require("../utils/validators");
const bcryptjs_1 = require("bcryptjs");
const PhoneValidation_1 = require("./PhoneValidation");
const apollo_server_express_1 = require("apollo-server-express");
const errors_1 = require("../errors");
let User = User_1 = class User extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.errors = {};
        this.inputErrors = undefined;
        this.uniquenessErrors = false;
        this.validateInput = (schema) => __awaiter(this, void 0, void 0, function* () {
            this.newPassword;
            this.inputErrors = yield validators_1.myValidator(schema, this);
            this.errors = Object.assign(this.errors, this.inputErrors);
            return this;
        });
        this.getErrors = (errorClass) => {
            if (this.uniquenessErrors || this.inputErrors)
                return Object.assign(errorClass ? new errorClass() : new errors_1.OnError(), this.errors);
            return undefined;
        };
        this.auth = (options = { validateOTP: false }) => __awaiter(this, void 0, void 0, function* () {
            if (options.validateOTP) {
                const phoneVerification = yield PhoneValidation_1.PhoneVerification.findOne({
                    where: { phoneNo: this.phoneNo },
                });
                if (!phoneVerification ||
                    !this.OTP ||
                    !phoneVerification.isValidOTP(this.OTP))
                    return undefined;
            }
            this.normalizeEmail();
            const user = yield User_1.findOne({
                where: { email: this.email },
            });
            if (!user)
                return undefined;
            const verified = yield bcryptjs_1.compare(this.password, user.password);
            if (!verified)
                return undefined;
            return user;
        });
        this.sendOTP = () => __awaiter(this, void 0, void 0, function* () {
            const phoneVerification = yield PhoneValidation_1.PhoneVerification.findOne({
                where: { phoneNo: this.phoneNo },
            });
            if (!phoneVerification)
                throw new apollo_server_express_1.ApolloError("Server can't perform  phone verification at this moment");
            if (phoneVerification.isShortRequest())
                return {
                    code: "SHORT_TIME_REQUEST",
                    message: "20 second interval is required between OTP requests",
                };
            yield phoneVerification.generateOTP().save();
            return phoneVerification.sendOTP();
        });
    }
    cart({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _1.Cart.findOne({
                where: {
                    id: req.session.cartId,
                },
                relations: ["cartItems"],
            });
        });
    }
    setRefreshToken() {
        this.refresh_token = middlewares_1.createRefreshToken({ userId: this.id });
    }
    normalizeEmail() {
        this.email = this.email.toLowerCase().normalize();
        return this;
    }
    setOTP(OTP) {
        this.OTP = OTP;
        return this;
    }
    validateUniqueness(exception) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            const validateEmail = () => __awaiter(this, void 0, void 0, function* () {
                user = yield User_1.findOne({ where: { email: this.email } });
                if (user) {
                    this.uniquenessErrors = true;
                    if ("email" in this.errors) {
                        this.errors["email"].push("Email already exists.");
                    }
                    else {
                        this.errors["email"] = ["Email already exists."];
                    }
                }
            });
            if (!exception || (exception && exception.user.email !== this.email))
                yield validateEmail();
            const validatePhone = () => __awaiter(this, void 0, void 0, function* () {
                user = yield User_1.findOne({ where: { phoneNo: this.phoneNo } });
                if (user) {
                    this.uniquenessErrors = true;
                    if ("phoneNo" in this.errors) {
                        this.errors["phoneNo"].push("Phone No. already exists.");
                    }
                    else {
                        this.errors["phoneNo"] = ["Phone No. already exists."];
                    }
                }
            });
            if (!exception ||
                (exception &&
                    exception.user.phoneNo.toString() !== this.phoneNo.toString()))
                yield validatePhone();
            return this;
        });
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            this.password = yield bcryptjs_1.hash(this.password, 12);
            return this.save();
        });
    }
    setNewPassword(newPassword) {
        this.newPassword = newPassword;
        return this;
    }
    isPasswordMatch(userPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcryptjs_1.compare(this.password, userPassword);
        });
    }
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Index(),
    typeorm_1.Column("varchar", { unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Index(),
    typeorm_1.Column("bigint", { unique: true }),
    __metadata("design:type", Number)
], User.prototype, "phoneNo", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(() => types_1.Role, { defaultValue: types_1.Role.USER }),
    typeorm_1.Column({ default: types_1.Role.USER }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.Column(),
    typeorm_1.Index(),
    __metadata("design:type", String)
], User.prototype, "refresh_token", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "authorizationId", void 0);
__decorate([
    type_graphql_1.Field(() => _1.Authorization, { nullable: true }),
    typeorm_1.OneToOne(() => _1.Authorization, (auth) => auth.user, {
        onDelete: "CASCADE",
        cascade: true,
        nullable: true,
        eager: true,
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", _1.Authorization)
], User.prototype, "authorization", void 0);
__decorate([
    type_graphql_1.Field(() => _1.Cart),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], User.prototype, "cart", null);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "setRefreshToken", null);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "normalizeEmail", null);
User = User_1 = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity("users")
], User);
exports.User = User;
//# sourceMappingURL=User.js.map