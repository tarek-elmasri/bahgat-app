"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authChecker = void 0;
const authChecker = ({ context }, role) => {
    if (role.includes("ADMIN")) {
        return true;
    }
    else {
        console.log(context, role);
    }
    return false;
};
exports.authChecker = authChecker;
//# sourceMappingURL=authChecker.js.map