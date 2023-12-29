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
// src/__tests__/signup.test.ts
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('Signup and Login', () => {
    it('should allow a user to signup and login', () => __awaiter(void 0, void 0, void 0, function* () {
        // Signup
        const signupResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/signup')
            .send({
            fullname: 'John Doe',
            email: 'bony@gmail.com',
            gender: 'male',
            phone: '+2347085227535',
            address: '15, rantech stop',
            password: 'password123',
        });
        expect(signupResponse.status).toBe(201);
        // Login
        const loginResponse = yield (0, supertest_1.default)(app_1.default)
            .post('/login')
            .send({
            email: 'bony@gmail.com',
            password: 'password123',
        });
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toHaveProperty('token');
    }));
});
