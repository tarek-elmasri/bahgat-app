"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressSessionConfig = void 0;
const out_1 = require("connect-typeorm/out");
const entity_1 = require("../entity");
const typeorm_1 = require("typeorm");
const expressSessionConfig = () => {
    const sessionRepository = typeorm_1.getConnection().getRepository(entity_1.Session);
    const expressSessionOptions = {
        name: "sid",
        resave: false,
        saveUninitialized: false,
        store: new out_1.TypeormStore({
            cleanupLimit: 2,
            limitSubquery: true,
            cookie: {
                sameSite: "lax",
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7 * 30 * 10,
            },
            ttl: 846000,
        }).connect(sessionRepository),
        secret: "keyboard cat",
    };
    return expressSessionOptions;
};
exports.expressSessionConfig = expressSessionConfig;
exports.default = exports.expressSessionConfig;
//# sourceMappingURL=expressSessionOptions.js.map