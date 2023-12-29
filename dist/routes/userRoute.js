"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/userRoute.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
// User registration route
router.post('/users', userController_1.createUser);
// Get user by ID
router.get('/users/:userId', userController_1.getUser);
// Get all users
router.get('/users', userController_1.getAllUsers);
exports.default = router;
