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
const Err_1 = require("../errors/Err");
const codes_1 = require("../errors/codes");
const typeorm_1 = require("typeorm");
const authorization_1 = require("../middlewares/authorization");
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
            const user = yield entity_1.User.findOne({
                where: { uuid: req.session.userUuid },
            });
            const cart = yield entity_1.Cart.findOne({
                where: {
                    uuid: req.session.cartUuid,
                },
                relations: ["cartItems"],
            });
            return { data: user, cart };
        });
    }
    user(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield entity_1.User.findOne({ where: { uuid } });
                if (!user)
                    throw new Err_1.Err(codes_1.ErrCode.NOT_FOUND, " No User Matched this ID.");
                return { payload: user };
            }
            catch (err) {
                return Err_1.Err.ResponseBuilder(err);
            }
        });
    }
    users() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield entity_1.User.find();
        });
    }
    login(email, password, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield entity_1.User.findOne({
                    where: { email: email.toLowerCase() },
                });
                if (!user)
                    throw new Err_1.Err(codes_1.ErrCode.INVALID_LOGIN, "Invalid Email or password.");
                const verified = bcryptjs_1.compare(password, user.password);
                if (!verified)
                    throw new Err_1.Err(codes_1.ErrCode.INVALID_LOGIN, "Invalid Email or Password.");
                req.session.userUuid = user.uuid;
                req.session.role = user.role;
                return {
                    payload: user,
                };
            }
            catch (err) {
                return Err_1.Err.ResponseBuilder(err);
            }
        });
    }
    register({ username, password, email }, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.session);
            try {
                const hashedPassword = yield bcryptjs_1.hash(password, 12);
                const user = entity_1.User.create({
                    username,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    sessionId: req.sessionID,
                    role: types_1.Role.USER,
                });
                yield user.save();
                req.session.userUuid = user.uuid;
                req.session.role = types_1.Role.USER;
                return {
                    payload: user,
                };
            }
            catch (err) {
                return Err_1.Err.ResponseBuilder(err);
            }
        });
    }
    updateUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exists = yield entity_1.User.findOne({ where: { uuid: params.uuid } });
                if (!exists)
                    throw new Err_1.Err(codes_1.ErrCode.NOT_FOUND, "Invalid UUID for User.");
                yield typeorm_1.getConnection()
                    .getRepository(entity_1.User)
                    .update({ uuid: params.uuid }, params.fields);
                const user = yield entity_1.User.findOne({ where: { uuid: params.uuid } });
                return {
                    payload: user,
                };
            }
            catch (err) {
                return Err_1.Err.ResponseBuilder(err);
            }
        });
    }
    deleteUser(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield entity_1.User.delete({ uuid });
                if (result.affected < 1)
                    throw new Err_1.Err(codes_1.ErrCode.NOT_FOUND, "No User matches this UUID");
                return {
                    ok: true,
                };
            }
            catch (err) {
                return Err_1.Err.ResponseBuilder(err);
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
    type_graphql_1.Query(() => types_1.UserResponse),
    type_graphql_1.UseMiddleware(authorization_1.isStaff),
    __param(0, type_graphql_1.Arg("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    type_graphql_1.Query(() => [entity_1.User]),
    type_graphql_1.UseMiddleware(authorization_1.isAdmin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.UserResponse),
    type_graphql_1.UseMiddleware(authorization_1.isGuest),
    __param(0, type_graphql_1.Arg("email")),
    __param(1, type_graphql_1.Arg("password")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.UserResponse),
    type_graphql_1.UseMiddleware(authorization_1.isGuest),
    __param(0, type_graphql_1.Arg("properties")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.CreateUserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.UserResponse),
    __param(0, type_graphql_1.Arg("properties", () => types_1.UpdateUserInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UpdateUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.SuccessResponse),
    type_graphql_1.UseMiddleware(authorization_1.isAdmin),
    __param(0, type_graphql_1.Arg("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map