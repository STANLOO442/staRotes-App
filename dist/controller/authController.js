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
exports.login = exports.signup = void 0;
const user_1 = __importDefault(require("../model/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_config_1 = require("../config/db.config");
// authController.ts
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { fullname, email, gender, phone, address, password } = req.body;
        console.log('Received form data:', req.body);
        // Check if all required fields are provided
        if (!fullname || !email || !gender || !phone || !address || !password) {
            res.status(400).json({ error: 'All fields are required' });
        }
        else {
            // Check if email is valid
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(400).json({ error: 'Invalid email format' });
            }
            else {
                // Check if the email is not already registered
                const existingUser = yield user_1.default.findOne({ where: { email } });
                if (existingUser) {
                    res.status(409).json({ error: 'Email is already registered. Please login.' });
                }
                else {
                    // Save user information to the database
                    const newUser = yield user_1.default.create({
                        fullname,
                        email,
                        gender,
                        phone,
                        address,
                        password
                    });
                    // Hash the password before saving
                    yield newUser.hashPassword();
                    // Save the user with the hashed password
                    yield newUser.save();
                    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
                }
            }
        }
    }
    catch (error) {
        console.error('Error signing up:', error);
        // Handle Sequelize validation error (unique constraint)
        if (error instanceof sequelize_1.UniqueConstraintError) {
            const field = (_a = error.errors[0]) === null || _a === void 0 ? void 0 : _a.path;
            res.status(409).json({ error: `${field} is already in use. Please choose a different value.` });
        }
        else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if the user exists in the database
        const user = yield user_1.default.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Compare the entered password with the hashed password in the database
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Generate JWT token upon successful login
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, db_config_1.JWT_SECRET);
        // Set the token in the cookies
        res.cookie('token', token, { httpOnly: true });
        // Return the user's email, fullname, and the token
        res.status(200).json({
            email: user.email,
            fullname: user.fullname,
            token,
        });
    }
    catch (error) {
        if (error instanceof sequelize_1.UniqueConstraintError) {
            res.status(400).json({ error: 'Email is already registered' });
        }
        else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
exports.login = login;
exports.default = { signup: exports.signup, login: exports.login };
