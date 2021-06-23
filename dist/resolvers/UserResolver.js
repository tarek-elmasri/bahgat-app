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
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const types_1 = require("../types");
const entity_1 = require("../entity");
const bcryptjs_1 = require("bcryptjs");
const errors_1 = require("../errors");
const typeorm_1 = require("typeorm");
const middlewares_1 = require("../middlewares");
const utils_1 = require("../utils");
const myValidator_1 = require("../utils/validators/myValidator");
let MeResponse = class MeResponse {
};
__decorate([
    type_graphql_1.Field(() => entity_1.User, { nullable: true }),
    __metadata("design:type", Object)
], MeResponse.prototype, "data", void 0);
__decorate([
    type_graphql_1.Field(() => entity_1.Cart, { nullable: true }),
    __metadata("design:type", Object)
], MeResponse.prototype, "cart", void 0);
MeResponse = __decorate([
    type_graphql_1.ObjectType()
], MeResponse);
let UserResolver = class UserResolver {
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield entity_1.Cart.findOne({
                where: {
                    uuid: req.session.cartUuid,
                },
                relations: ["cartItems"],
            });
            return { data: req.user, cart };
        });
    }
    login(input, { req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield entity_1.User.findOne({
                    where: { email: input.email.normalize().toLowerCase() },
                    relations: ["authorization"],
                });
                if (!user)
                    throw new errors_1.Err(errors_1.ErrCode.INVALID_LOGIN, "Invalid Email or password.");
                const verified = bcryptjs_1.compare(input.password, user.password);
                if (!verified)
                    throw new errors_1.Err(errors_1.ErrCode.INVALID_LOGIN, "Invalid Email or Password.");
                req.user = user;
                yield utils_1.syncCart(req, res);
                return {
                    payload: user,
                };
            }
            catch (err) {
                return errors_1.Err.ResponseBuilder(err);
            }
        });
    }
    register(input, { req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formErrors = yield myValidator_1.myValidator(input, myValidator_1.createUserRules);
                if (formErrors)
                    return { errors: formErrors };
                const { username, email, password } = input;
                const hashedPassword = yield bcryptjs_1.hash(password, 12);
                const user = yield entity_1.User.create({
                    username,
                    email: email.normalize().toLowerCase(),
                    password: hashedPassword,
                    role: types_1.Role.USER,
                    authorization: undefined,
                }).save();
                yield entity_1.Cart.update({ uuid: req.session.cartUuid }, { userUuid: user.uuid });
                req.session.refresh_token = user.refresh_token;
                yield middlewares_1.updateSession(req.session, user, req, res);
                return {
                    payload: user,
                };
            }
            catch (err) {
                return errors_1.Err.ResponseBuilder(err);
            }
        });
    }
    updateMe({ fields }, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { user } = req;
                if (!user)
                    throw new errors_1.Err(errors_1.ErrCode.NOT_FOUND, "No user found for current request.");
                const userForm = {
                    username: fields.username || user.username,
                    email: fields.email.normalize().toLowerCase() || user.email,
                    password: fields.password || user.password,
                };
                const formErrors = yield myValidator_1.myValidator(userForm, myValidator_1.createUserRules);
                if (formErrors)
                    return { errors: formErrors };
                yield typeorm_1.getConnection()
                    .getRepository(entity_1.User)
                    .update({ uuid: user.uuid }, fields);
                user = yield entity_1.User.findOne({ where: { uuid: user.uuid } });
                return {
                    payload: user,
                };
            }
            catch (err) {
                return errors_1.Err.ResponseBuilder(err);
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => MeResponse, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.UserResponse),
    type_graphql_1.UseMiddleware(middlewares_1.isGuest),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.UserResponse),
    type_graphql_1.UseMiddleware(middlewares_1.isGuest),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.CreateUserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.UserResponse),
    __param(0, type_graphql_1.Arg("properties", () => types_1.UpdateUserInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UpdateUserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateMe", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map