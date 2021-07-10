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
const middlewares_1 = require("../middlewares");
const utils_1 = require("../utils");
const auth_1 = require("../auth");
const validators_1 = require("../utils/validators");
const errors_1 = require("../errors");
let UserResolver = class UserResolver {
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cart, user } = req;
            return { user, cart };
        });
    }
    login(credentials, { req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const formErrors = yield validators_1.loginValidator(credentials);
            if (formErrors)
                return {
                    errors: new errors_1.OnError("INVALID_CREDENTIALS", "Invalid Email or Password."),
                };
            const user = yield auth_1.Login(credentials);
            if (!user)
                return {
                    errors: new errors_1.OnError("INVALID_CREDENTIALS", "Invalid Email or Password."),
                };
            const { session } = req;
            const cart = yield utils_1.syncCart(user, session);
            session.cartUuid = cart.uuid;
            yield middlewares_1.updateSession(session, user, req, res);
            return { payload: new types_1.LoginSuccess(user, cart) };
        });
    }
    register(input, { req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const formErrors = yield validators_1.registerValidator(input);
            if (formErrors)
                return { errors: formErrors };
            let user = yield entity_1.User.findOne({
                where: { email: utils_1.normalizeEmail(input.email) },
            });
            if (user)
                return {
                    errors: new types_1.RegisterErrors("EMAIL_ALREADY_EXISTS", [
                        "Email already exists.",
                    ]),
                };
            user = yield auth_1.Register(input);
            const { session, cart } = req;
            cart.userUuid = user.uuid;
            yield cart.save();
            yield middlewares_1.updateSession(session, user, req, res);
            return { payload: new types_1.LoginSuccess(user, cart) };
        });
    }
    updateMe(fields, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const formErrors = yield validators_1.updateMeValidator(fields);
            if (formErrors)
                return { errors: formErrors };
            const updatedUser = yield utils_1.updateEntity(entity_1.User, { uuid: user.uuid }, { email: utils_1.normalizeEmail(fields.email), username: fields.username });
            return { payload: updatedUser };
        });
    }
    LogOut({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield middlewares_1.deleteSession(req.session);
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => types_1.MeResponse, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.LoginResponse),
    type_graphql_1.UseMiddleware(middlewares_1.isGuest),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.RegisterResponse),
    type_graphql_1.UseMiddleware(middlewares_1.isGuest),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.RegisterInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.UpdateMeResponse),
    type_graphql_1.UseMiddleware(middlewares_1.isAuthenticated),
    __param(0, type_graphql_1.Arg("fields", () => types_1.UpdateUserInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UpdateUserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateMe", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "LogOut", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map