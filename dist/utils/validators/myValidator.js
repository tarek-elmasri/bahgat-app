"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.myValidator = exports.uuidV4 = void 0;
const yup = __importStar(require("yup"));
exports.uuidV4 = yup
    .string()
    .required("UUID is required.")
    .uuid("Invalid UUID Syntax.");
const myValidator = (schema, input, errorClass) => __awaiter(void 0, void 0, void 0, function* () {
    return yup
        .object()
        .shape(schema)
        .validate(input, { abortEarly: false })
        .then((_) => undefined)
        .catch((err) => Object.assign(new errorClass(), formatError(err)));
});
exports.myValidator = myValidator;
const formatError = (err) => {
    var _a;
    let result = {};
    (_a = err.inner) === null || _a === void 0 ? void 0 : _a.forEach((vErr) => {
        if (vErr.path in result) {
            result[vErr.path].push(vErr.message);
        }
        else {
            result[vErr.path] = [vErr.message];
        }
    });
    return result;
};
//# sourceMappingURL=myValidator.js.map