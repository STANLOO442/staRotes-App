"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controller/dashboardController");
const router = express_1.default.Router();
/* GET Dashboard. */
router.get('/dashboard', dashboardController_1.dashboardController);
exports.default = router;
