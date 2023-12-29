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
exports.about = exports.homepage = void 0;
const homepage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locals = {
        title: "Stanley's Note App",
        description: "Express.ts"
    };
    res.render('index', {
        locals,
        layout: '../my-views/layouts/font-page'
    });
});
exports.homepage = homepage;
const about = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locals = {
        title: " About Stanley's Note ",
        description: "Express.ts"
    };
    res.render('about', locals);
});
exports.about = about;
