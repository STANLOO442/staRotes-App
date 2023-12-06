"use strict";
// authController.ts
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
exports.authenticateToken = exports.login = exports.signup = void 0;
const user_1 = __importDefault(require("../model/user"));
const sequelize_1 = require("sequelize");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_config_1 = require("../config/db.config");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { fullname, email, gender, phone, address, password } = req.body;
        // Check if all required fields are provided
        if (!fullname || !email || !gender || !phone || !address || !password) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }
        // Check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }
        // Check if the email is not already registered
        const existingUser = yield user_1.default.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({ error: 'Email is already registered. Please login.' });
            return;
        }
        // Save user information to the database
        const newUser = yield user_1.default.create({
            fullname,
            email,
            gender,
            phone,
            address,
            password,
        });
        yield newUser.hashPassword(); // Hash the password before saving
        yield newUser.save();
        res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
    }
    catch (error) {
        console.error('Error signing up:', error);
        // Handle Sequelize validation error (unique constraint)
        if (error instanceof sequelize_1.UniqueConstraintError) {
            const field = (_a = error.errors[0]) === null || _a === void 0 ? void 0 : _a.path;
            res.status(409).json({ error: `${field} is already in use. Please choose a different value.` });
            return;
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.signup = signup;
// authController.ts
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if email and password are provided
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        // Find the user with the provided email
        const user = yield user_1.default.findOne({ where: { email } });
        // Check if the user exists
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Check if the provided password matches the stored password
        const isValidPassword = yield user.comparePassword(password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Generate JWT token upon successful login
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, db_config_1.JWT_SECRET);
        // Return the user's email, fullname, and the token
        res.status(200).json({
            email: user.email,
            fullname: user.fullname,
            token,
        });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.login = login;
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const token = (_b = req.header('Authorization')) === null || _b === void 0 ? void 0 : _b.replace('Bearer ', '');
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
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.error('Invalid authorization token');
            res.status(401).json({ error: 'Invalid authorization token' });
        }
        else {
            console.error('Authorization failed');
            res.status(401).json({ error: 'Authorization failed' });
        }
    }
});
exports.authenticateToken = authenticateToken;
exports.default = { signup: exports.signup, login: exports.login, authenticateToken: exports.authenticateToken };
