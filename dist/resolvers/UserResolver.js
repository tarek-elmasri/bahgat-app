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
const entity_1 = require("../entity");
const utils_1 = require("../utils");
const errors_1 = require("../errors");
const type_graphql_1 = require("type-graphql");
const types_1 = require("../types");
const middlewares_1 = require("../middlewares");
const validators_1 = require("../utils/validators");
const typeorm_1 = require("typeorm");
let UserResolver = class UserResolver {
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cart, user } = req;
            return { user, cart };
        });
    }
    createLogin(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAttempt = yield entity_1.User.create(input)
                .normalizeEmail()
                .validateInput(validators_1.createLoginSchema);
            if (userAttempt.getErrors())
                return { errors: userAttempt.getErrors() };
            const user = yield userAttempt.auth();
            if (!user)
                return {
                    errors: new errors_1.OnError("INVALID_CREDENTIALS", "Invalid Email or Password"),
                };
            const otpResponse = yield user.sendOTP();
            if (otpResponse.code !== "1")
                return { errors: new errors_1.OnError(otpResponse.code, otpResponse.message) };
            return { payload: otpResponse.message };
        });
    }
    login(credentials, { req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAttempt = yield entity_1.User.create(credentials)
                .setOTP(credentials.OTP)
                .validateInput(validators_1.loginSchema);
            const errors = userAttempt.getErrors(errors_1.OnError);
            if (errors) {
                errors.code = "INVALID_CREDENTIALS";
                errors.message = "Invalid Email or Password";
                return { errors };
            }
            const user = yield userAttempt.auth({ validateOTP: true });
            if (!user)
                return {
                    errors: new errors_1.OnError("INVALID_CREDENTIALS", "Invalid credentials or OTP."),
                };
            const { session } = req;
            const cart = yield utils_1.syncCart(user, session);
            session.cartId = cart.id;
            yield middlewares_1.updateSession(session, user, req, res);
            return { payload: new types_1.LoginSuccess(user, cart) };
        });
    }
    createRegistration(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAttempt = yield (yield entity_1.User.create(input)
                .normalizeEmail()
                .validateInput(validators_1.createRegistrationSchema)).validateUniqueness();
            const errors = userAttempt.getErrors(types_1.CreateRegisterationErrors);
            if (errors)
                return { errors };
            let phoneVerification = yield entity_1.PhoneVerification.findOne({
                where: { phoneNo: input.phoneNo },
            });
            if (phoneVerification && phoneVerification.isShortRequest())
                return {
                    errors: new types_1.CreateRegisterationErrors("SHORT_TIME_REQUEST", "Interval between OTP requests must exceed 20 secsonds."),
                };
            if (!phoneVerification) {
                phoneVerification = entity_1.PhoneVerification.create({
                    phoneNo: input.phoneNo,
                });
            }
            yield phoneVerification.generateOTP().save();
            const otpResponse = yield phoneVerification.sendOTP();
            if (otpResponse.code !== "1")
                return {
                    errors: new types_1.CreateRegisterationErrors(otpResponse.code, otpResponse.message),
                };
            return {
                payload: {
                    message: "OTP is successfully sent to phone no.",
                    code: "Success",
                },
            };
        });
    }
    register(input, { req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = entity_1.User.create(input).normalizeEmail().setOTP(input.OTP);
            yield user.validateInput(validators_1.registerSchema);
            yield user.validateUniqueness();
            const errors = user.getErrors(types_1.RegisterErrors);
            if (errors)
                return { errors };
            const verifiedPhone = yield entity_1.PhoneVerification.findOne({
                where: { phoneNo: input.phoneNo },
            });
            if (!verifiedPhone)
                return {
                    errors: new types_1.RegisterErrors("PHONE_NOT_VERIFIED", undefined, [
                        "Phone not verified, Call createRegisteration first.",
                    ]),
                };
            if (!verifiedPhone.isValidOTP(input.OTP))
                return {
                    errors: new types_1.RegisterErrors("INVALID_OTP", undefined, undefined, undefined, undefined, ["Invalid or expired OTP."]),
                };
            yield user.register();
            const { session, cart } = req;
            cart.userId = user.id;
            yield cart.save();
            yield middlewares_1.updateSession(session, user, req, res);
            return { payload: new types_1.LoginSuccess(user, cart) };
        });
    }
    updateMe(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const errors = (yield (yield entity_1.User.create(input).normalizeEmail().validateInput(validators_1.updateMeSchema)).validateUniqueness({ user: user })).getErrors(types_1.UpdateMeErrors);
            if (errors)
                return { errors };
            yield typeorm_1.getConnection().getRepository(entity_1.User).update({ id: user.id }, input);
            yield user.reload();
            return { payload: user };
        });
    }
    LogOut({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield middlewares_1.deleteSession(req.session);
            return true;
        });
    }
    createResetPassword(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const userAttempt = entity_1.User.create({
                password: input.oldPassword,
            }).setNewPassword(input.newPassword);
            yield userAttempt.validateInput(validators_1.createResetPasswordSchema);
            const errors = userAttempt.getErrors(types_1.CreateResetPasswordErrors);
            if (errors)
                return { errors };
            if (!(yield userAttempt.isPasswordMatch(user.password)))
                return {
                    errors: new types_1.CreateResetPasswordErrors("INVALID_CREDENTIALS", "Invalid credentials", ["Invalid user Password."]),
                };
            const otpResponse = yield user.sendOTP();
            if (otpResponse.code !== "1")
                return {
                    errors: otpResponse,
                };
            return {
                payload: new types_1.OTP_Response("Success", "OTP sent successfully to user phoneNo."),
            };
        });
    }
    resetPassword(input, { req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, session } = req;
            const userAttempt = entity_1.User.create({ password: input.oldPassword })
                .setOTP(input.OTP)
                .setNewPassword(input.newPassword);
            yield userAttempt.validateInput(validators_1.resetPasswordSchema);
            const errors = userAttempt.getErrors(types_1.ResetPasswordErrors);
            if (errors)
                return { errors };
            if (!(yield userAttempt.isPasswordMatch(user.password)))
                return {
                    errors: new types_1.ResetPasswordErrors("INVALID_CREDENTIALS", "Invalid credentials", ["Invalid user Password."]),
                };
            const verifiedPhone = yield entity_1.PhoneVerification.findOne({
                where: { phoneNo: user.phoneNo },
            });
            if (!verifiedPhone.isValidOTP(input.OTP))
                return {
                    errors: new types_1.ResetPasswordErrors("INVALID_OTP", "Invalid OTP Match.", undefined, undefined, ["Invalid or expired OTP."]),
                };
            user.password = input.newPassword;
            user.setRefreshToken();
            yield user.register();
            yield middlewares_1.updateSession(session, user, req, res);
            return {
                payload: {
                    code: "Success",
                    message: "Password has successfully updated",
                },
            };
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
    type_graphql_1.Mutation(() => types_1.CreateLoginResponse),
    type_graphql_1.UseMiddleware(middlewares_1.isGuest),
    __param(0, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.CreateLoginInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createLogin", null);
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
    type_graphql_1.Mutation(() => types_1.CreateRegisterationResponse),
    __param(0, type_graphql_1.Arg("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.CreateRegistrationInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createRegistration", null);
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
    __param(0, type_graphql_1.Arg("input", () => types_1.UpdateUserInput)),
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
__decorate([
    type_graphql_1.Mutation(() => types_1.CreateResetPasswordResponse),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.CreateResetPasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createResetPassword", null);
__decorate([
    type_graphql_1.Mutation(() => types_1.ResetPasswordResponse),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.ResetPasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "resetPassword", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map