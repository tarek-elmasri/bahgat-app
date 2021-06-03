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
exports.UpdateUserInput = exports.CreateUserInput = void 0;
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
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateUserProperties.prototype, "role", void 0);
UpdateUserProperties = __decorate([
    type_graphql_1.InputType()
], UpdateUserProperties);
let UpdateUserInput = class UpdateUserInput {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], UpdateUserInput.prototype, "uuid", void 0);
__decorate([
    type_graphql_1.Field(() => UpdateUserProperties),
    __metadata("design:type", UpdateUserProperties)
], UpdateUserInput.prototype, "properties", void 0);
UpdateUserInput = __decorate([
    type_graphql_1.InputType()
], UpdateUserInput);
exports.UpdateUserInput = UpdateUserInput;
//# sourceMappingURL=UserInputs.js.map