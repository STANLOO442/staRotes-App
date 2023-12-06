"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelizeDb = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: 'path/to/database.sqlite',
    logging: false
});
exports.default = sequelizeDb;
