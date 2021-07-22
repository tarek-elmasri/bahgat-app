var _a;
let str = " ! s ";
let tex = "";
const result = (_a = str.match(/\w+/g)) === null || _a === void 0 ? void 0 : _a.forEach((word) => (tex = tex + word + " "));
tex = tex.trim();
console.log(str);
console.log(tex.length);
//# sourceMappingURL=test.js.map