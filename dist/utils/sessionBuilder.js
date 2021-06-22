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
exports.resetSession = exports.createRefreshToken = exports.updateSession = exports.sessionBuilder = void 0;
const entity_1 = require("../entity");
const jsonwebtoken_1 = require("jsonwebtoken");
const sessionBuilder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let session;
    let user;
    const cookie = req.cookies.sid;
    if (!cookie) {
        session = yield createSession(req, res);
        return next();
    }
    session = yield entity_1.Session.findOne({ where: { id: cookie.id } });
    if (!session) {
        session = yield createSession(req, res);
        return next();
    }
    if (!session.access_token) {
        req.session = session;
        return next();
    }
    const payload = decodeAccessToken(session.access_token);
    if (payload) {
        user = yield entity_1.User.findOne({
            where: { uuid: payload.userUuid },
            relations: ["authorization"],
        });
        if (user) {
            yield exports.updateSession(session, user, req, res);
        }
        else {
            yield exports.resetSession(session, req, res);
        }
    }
    else {
        user = yield entity_1.User.findOne({
            where: { refresh_token: session.refresh_token },
            relations: ["authorization"],
        });
        if (!user) {
            yield exports.resetSession(session, req, res);
        }
        else {
            yield exports.updateSession(session, user, req, res);
        }
    }
    next();
});
exports.sessionBuilder = sessionBuilder;
const createSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield entity_1.Cart.create().save();
    const session = yield entity_1.Session.create({
        cartUuid: cart.uuid,
    }).save();
    req.session = session;
    setCookie(session, res);
    return session;
});
const setCookie = (session, res) => {
    res.cookie("sid", {
        id: session.id,
        cartUuid: session.cartUuid,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
    });
};
const decodeAccessToken = (access_token) => {
    return jsonwebtoken_1.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err)
            return undefined;
        return decoded;
    });
};
const createAccessToken = (data) => {
    return jsonwebtoken_1.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};
const updateSession = (session, user, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    session.access_token = createAccessToken({ userUuid: user.uuid });
    yield session.save();
    setCookie(session, res);
    req.session = session;
    req.user = user;
});
exports.updateSession = updateSession;
const createRefreshToken = (data) => {
    return jsonwebtoken_1.sign(data, process.env.REFRESH_TOKEN_SECRET);
};
exports.createRefreshToken = createRefreshToken;
const resetSession = (session, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield entity_1.Cart.create().save();
    session.access_token = undefined;
    session.refresh_token = undefined;
    session.cartUuid = cart.uuid;
    yield session.save();
    setCookie(session, res);
    req.session = session;
    req.user = undefined;
});
exports.resetSession = resetSession;
//# sourceMappingURL=sessionBuilder.js.map