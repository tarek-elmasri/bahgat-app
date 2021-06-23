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
exports.LoginInput = exports.PanelUpdateUserInput = exports.UpdateUserInput = exports.CreateUserInput = void 0;
const type_graphql_1 = require("type-graphql");
let CreateUserInput = class CreateUserInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateUserInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateUserInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateUserInput.prototype, "password", void 0);
CreateUserInput = __decorate([
    type_graphql_1.InputType()
], CreateUserInput);
exports.CreateUserInput = CreateUserInput;
let UpdateUserProperties = class UpdateUserProperties {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateUserProperties.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateUserProperties.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateUserProperties.prototype, "password", void 0);
UpdateUserProperties = __decorate([
    type_graphql_1.InputType()
], UpdateUserProperties);
let UpdateUserInput = class UpdateUserInput {
};
__decorate([
    type_graphql_1.Field(() => UpdateUserProperties),
    __metadata("design:type", UpdateUserProperties)
], UpdateUserInput.prototype, "fields", void 0);
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
    type_graphql_1.Field(() => String, { nullable: true }),
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
], PanelUpdateUserInput.prototype, "uuid", void 0);
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
let LoginInput = class LoginInput {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], LoginInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
LoginInput = __decorate([
    type_graphql_1.InputType()
], LoginInput);
exports.LoginInput = LoginInput;
//# sourceMappingURL=UserInputs.js.map