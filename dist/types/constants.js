"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSEGAT_API_KEY = exports.MSEGAT_USERNAME = exports.OTP_REQUEST_INTERVAL = exports.OTP_EXPIRATION_MINS = exports.__producation__ = void 0;
exports.__producation__ = process.env.NODE_ENV === "production";
exports.OTP_EXPIRATION_MINS = 1000 * 60 * 10;
exports.OTP_REQUEST_INTERVAL = 1000 * 15;
exports.MSEGAT_USERNAME = process.env.MSEGAT_USERNAME;
exports.MSEGAT_API_KEY = process.env.MSEGAT_API_KEY;
//# sourceMappingURL=constants.js.map