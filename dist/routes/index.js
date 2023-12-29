"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mainController_1 = require("../controller/mainController");
const mainController_2 = require("../controller/mainController");
const router = express_1.default.Router();
/* GET home page. */
router.get('/', mainController_1.homepage);
router.get('/about', mainController_2.about);
exports.default = router;
