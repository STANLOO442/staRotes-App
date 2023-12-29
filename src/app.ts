// app.ts

import express, { Request, Response, NextFunction } from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import path from 'path';
import {Router} from 'express'
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middleware/authMiddleware';
import cookieParser from 'cookie-parser'; 
import methodOverride from 'method-override';

// Routes
 import authController from './controller/authController'
import { Sequelize } from 'sequelize';  
import morgan from 'morgan';

const app = express();

dotenv.config();



app.use(cookieParser()); 
// view engine setup
app.use(expressEjsLayouts)
app.set('views', path.join(__dirname,"../", 'my-views'));
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname,'../', 'public')));


// ...
app.use(express.json());

app.use('/', authRoutes);
app.use('/auth', authenticateToken, authRoutes);
app.use(methodOverride('_method'));
app.use(cors());
app.use(morgan('combined'))
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Sequelize initialization
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../', 'database.sqlite'), // Provide the correct path to your SQLite database file
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


app.post('/signup', authController.signup);
app.post('/login', authController.login);
// app.use('/', authController)


export default app;







