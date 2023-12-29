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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const db_config_1 = __importDefault(require("./config/db.config"));
const user_1 = __importDefault(require("./model/user"));
// Function to seed data
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Sync models with the database
        yield db_config_1.default.sync({ alter: true });
        // Seed a user
        const user = yield user_1.default.create({
            fullname: "Victor Boniface",
            email: "bony@gmail.com",
            gender: "male",
            phone: "08031228966",
            address: "50, orchid road",
            password: "3450pro"
        });
        // Seed a note related to the user
        console.log("Data seeded successfully");
    }
    catch (error) {
        console.error("Error seeding data:", error);
    }
});
exports.seed = seed;
// Call the seed function
(0, exports.seed)();
