"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Err = void 0;
const apollo_server_express_1 = require("apollo-server-express");
class Err extends apollo_server_express_1.ApolloError {
    constructor(code, message, extention) {
        super(message, code, extention);
        this.code = code;
        this.message = message;
    }
}
exports.Err = Err;
Err.ResponseBuilder = (err) => {
    console.log(err.code, err.message);
    let { code, message } = err;
    let field;
    if (code === "23505") {
        message = "Email already exists.";
        field = "Email";
    }
    if (code === "22P02") {
        message = "Invalid UUID Syntax.";
    }
    return {
        errors: [
            {
                code: code,
                message: message || "Bad Request",
                field,
            },
        ],
    };
};
//# sourceMappingURL=Err.js.map