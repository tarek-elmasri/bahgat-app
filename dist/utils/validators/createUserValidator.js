"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myValidator = exports.createUserRules = void 0;
const node_input_validator_1 = __importDefault(require("node-input-validator"));
const codes_1 = require("../../errors/codes");
exports.createUserRules = {
    username: "required|minLength:4",
    email: "required|email",
    password: "required|minLength:4",
};
const extendedMessages = {
    required: "Required Field.",
    minLength: "Too short.",
    email: "Invalid Email format.",
};
const myValidator = (input, rules) => __awaiter(void 0, void 0, void 0, function* () {
    const validator = new node_input_validator_1.default.Validator(input, rules);
    node_input_validator_1.default.extendMessages(extendedMessages);
    validator.bail(false);
    yield validator.check();
    const { errors } = validator;
    if (Object.keys(errors).length < 1)
        return undefined;
    let myErrors = [];
    Object.keys(errors).forEach((field) => {
        errors[field].forEach((err) => {
            myErrors.push({
                field,
                message: err.message,
                code: codes_1.ErrCode.INVALID_LOGIN,
            });
        });
    });
    return myErrors;
});
exports.myValidator = myValidator;
//# sourceMappingURL=createUserValidator.js.map