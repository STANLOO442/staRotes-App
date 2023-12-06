"use strict";
// authController.ts
// authMiddleware.ts
// authMiddleware.ts
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
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_config_1 = require("../config/db.config");
const user_1 = __importDefault(require("../model/user"));
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        console.error('Authorization token is missing');
        res.status(401).json({ error: 'Authorization token is missing' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, db_config_1.JWT_SECRET);
        const user = yield user_1.default.findOne({ where: { id: decoded.id } });
        if (!user) {
            console.error('User not found');
            res.status(401).json({ error: 'User not found' });
            return;
        }
        req.user = { id: user.id }; // Add other user properties as needed
        next();
    }
    catch (error) {
        console.error(error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            console.error('Authorization token has expired');
            res.status(401).json({ error: 'Authorization token has expired' });
            return;
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.error('Invalid authorization token');
            res.status(401).json({ error: 'Invalid authorization token' });
            return;
        }
        else {
            console.error('Authorization failed');
            res.status(401).json({ error: 'Authorization failed' });
            return;
        }
    }
});
exports.authenticateToken = authenticateToken;
// You can add more middleware functions as needed
