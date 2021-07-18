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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgetPasswordInput = exports.CreateForgetPasswordInput = exports.UpdatePhoneNoInput = exports.ResetPasswordInput = exports.CreateResetPasswordInput = exports.LoginInput = exports.CreateLoginInput = exports.PanelUpdateUserInput = exports.UpdateUserInput = exports.RegisterInput = exports.CreateRegistrationInput = void 0;
const type_graphql_1 = require("type-graphql");
const Role_1 = require("./Role");
let CreateRegistrationInput = class CreateRegistrationInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateRegistrationInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateRegistrationInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateRegistrationInput.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], CreateRegistrationInput.prototype, "phoneNo", void 0);
CreateRegistrationInput = __decorate([
    type_graphql_1.InputType()
], CreateRegistrationInput);
exports.CreateRegistrationInput = CreateRegistrationInput;
let RegisterInput = class RegisterInput extends CreateRegistrationInput {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], RegisterInput.prototype, "OTP", void 0);
RegisterInput = __decorate([
    type_graphql_1.InputType()
], RegisterInput);
exports.RegisterInput = RegisterInput;
let UpdateUserInput = class UpdateUserInput {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "email", void 0);
UpdateUserInput = __decorate([
    type_graphql_1.InputType()
], UpdateUserInput);
exports.UpdateUserInput = UpdateUserInput;
let AuthorizationInput = class AuthorizationInput {
};
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], AuthorizationInput.prototype, "viewAllUsers", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], AuthorizationInput.prototype, "updateUser", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], AuthorizationInput.prototype, "deleteUser", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], AuthorizationInput.prototype, "addItem", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], AuthorizationInput.prototype, "updateItem", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], AuthorizationInput.prototype, "deleteItem", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], AuthorizationInput.prototype, "addCategory", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], AuthorizationInput.prototype, "updateCategory", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], AuthorizationInput.prototype, "deleteCategory", void 0);
AuthorizationInput = __decorate([
    type_graphql_1.InputType()
], AuthorizationInput);
let PanelUpdateUserProperties = class PanelUpdateUserProperties {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PanelUpdateUserProperties.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PanelUpdateUserProperties.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(() => Role_1.Role, { nullable: true }),
    __metadata("design:type", String)
], PanelUpdateUserProperties.prototype, "role", void 0);
PanelUpdateUserProperties = __decorate([
    type_graphql_1.InputType()
], PanelUpdateUserProperties);
let PanelUpdateUserInput = class PanelUpdateUserInput {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], PanelUpdateUserInput.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => PanelUpdateUserProperties),
    __metadata("design:type", PanelUpdateUserProperties)
], PanelUpdateUserInput.prototype, "fields", void 0);
__decorate([
    type_graphql_1.Field(() => AuthorizationInput, { nullable: true }),
    __metadata("design:type", AuthorizationInput)
], PanelUpdateUserInput.prototype, "authorization", void 0);
PanelUpdateUserInput = __decorate([
    type_graphql_1.InputType()
], PanelUpdateUserInput);
exports.PanelUpdateUserInput = PanelUpdateUserInput;
let CreateLoginInput = class CreateLoginInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateLoginInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateLoginInput.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], CreateLoginInput.prototype, "phoneNo", void 0);
CreateLoginInput = __decorate([
    type_graphql_1.InputType()
], CreateLoginInput);
exports.CreateLoginInput = CreateLoginInput;
let LoginInput = class LoginInput extends CreateLoginInput {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], LoginInput.prototype, "OTP", void 0);
LoginInput = __decorate([
    type_graphql_1.InputType()
], LoginInput);
exports.LoginInput = LoginInput;
let CreateResetPasswordInput = class CreateResetPasswordInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateResetPasswordInput.prototype, "oldPassword", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateResetPasswordInput.prototype, "newPassword", void 0);
CreateResetPasswordInput = __decorate([
    type_graphql_1.InputType()
], CreateResetPasswordInput);
exports.CreateResetPasswordInput = CreateResetPasswordInput;
let ResetPasswordInput = class ResetPasswordInput extends CreateResetPasswordInput {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ResetPasswordInput.prototype, "OTP", void 0);
ResetPasswordInput = __decorate([
    type_graphql_1.InputType()
], ResetPasswordInput);
exports.ResetPasswordInput = ResetPasswordInput;
let UpdatePhoneNoInput = class UpdatePhoneNoInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], UpdatePhoneNoInput.prototype, "phoneNo", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], UpdatePhoneNoInput.prototype, "OTP", void 0);
UpdatePhoneNoInput = __decorate([
    type_graphql_1.InputType()
], UpdatePhoneNoInput);
exports.UpdatePhoneNoInput = UpdatePhoneNoInput;
let CreateForgetPasswordInput = class CreateForgetPasswordInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateForgetPasswordInput.prototype, "newPassword", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], CreateForgetPasswordInput.prototype, "phoneNo", void 0);
CreateForgetPasswordInput = __decorate([
    type_graphql_1.InputType()
], CreateForgetPasswordInput);
exports.CreateForgetPasswordInput = CreateForgetPasswordInput;
let ForgetPasswordInput = class ForgetPasswordInput extends CreateForgetPasswordInput {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ForgetPasswordInput.prototype, "OTP", void 0);
ForgetPasswordInput = __decorate([
    type_graphql_1.InputType()
], ForgetPasswordInput);
exports.ForgetPasswordInput = ForgetPasswordInput;
//# sourceMappingURL=UserInputs.js.map