import { Sequelize } from 'sequelize';

import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';


const sequelizeDb = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

export default sequelizeDb;


