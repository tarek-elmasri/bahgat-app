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
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomInteger = void 0;
const validators_1 = require("../utils/validators");
const randomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.randomInteger = randomInteger;
const testing = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(yield validators_1.myValidator(validators_1.uuidSchema, {
        id: "3434534.asdfs.##F",
        email: "dsds@gmal",
    }));
});
testing();
//# sourceMappingURL=test.js.map