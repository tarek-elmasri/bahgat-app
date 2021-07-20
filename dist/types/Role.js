"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const type_graphql_1 = require("type-graphql");
var Role;
(function (Role) {
    Role["ADMIN"] = "Admin";
    Role["STAFF"] = "STAFF";
    Role["USER"] = "USER";
})(Role = exports.Role || (exports.Role = {}));
type_graphql_1.registerEnumType(Role, {
    name: "Role",
    description: "basic user role.",
});
//# sourceMappingURL=Role.js.map