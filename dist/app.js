"use strict";
// app.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const method_override_1 = __importDefault(require("method-override"));
// Routes
const authController_1 = __importDefault(require("./controller/authController"));
const sequelize_1 = require("sequelize");
const morgan_2 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
dotenv.config();
app.use((0, cookie_parser_1.default)());
// view engine setup
app.use(express_ejs_layouts_1.default);
app.set('views', path_1.default.join(__dirname, "../", 'my-views'));
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.join(__dirname, '../', 'public')));
// ...
app.use(express_1.default.json());
app.use('/', authRoutes_1.default);
app.use('/auth', authMiddleware_1.authenticateToken, authRoutes_1.default);
app.use((0, method_override_1.default)('_method'));
app.use((0, cors_1.default)());
app.use((0, morgan_2.default)('combined'));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
// Sequelize initialization
const sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: path_1.default.join(__dirname, '../', 'database.sqlite'), // Provide the correct path to your SQLite database file
});
sequelize
    .authenticate()
    .then(() => {
    console.log('Connection to the database has been established successfully.');
})
    .catch((err) => {
    console.error('Unable to connect to the database:', err);
});
// Synchronize models with the database
sequelize.sync({ alter: true })
    .then(() => {
    console.log('Models synchronized with the database.');
})
    .catch((err) => {
    console.error('Error synchronizing models with the database:', err);
});
// ...
// Use middleware
app.post('/signup', authController_1.default.signup);
app.post('/login', authController_1.default.login);
// app.use('/', authController)
exports.default = app;
