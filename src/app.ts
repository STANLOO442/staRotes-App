// app.ts

import express, { Request, Response, NextFunction } from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';
import authController from './controller/authController';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middleware/authMiddleware';

// Routes
//  import indexRouter from './routes';
//  import userRoutes from './routes/userRoute'; // Assuming you have a file named userRoute.ts in the routes folder

// import dashboard from './routes/dashboard';
// import loginRouter from './routes/login';
// import authController from './controller/authController'
// import notesRouter from './routes/noteRoute';
// import signupRouter from './routes/signup';
// import userRoute from './routes/userRoute';
import { Sequelize } from 'sequelize';  // Import Sequelize instance and models
import morgan from 'morgan';

const app = express();

dotenv.config();


// view engine setup
app.use(expressEjsLayouts)
app.set('views', path.join(__dirname,"../", 'my-views'));
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname,'../', 'public')));

// ...
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/auth', authenticateToken, authRoutes);
app.use(cors());
app.use(morgan('combined'))
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

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

// Use your routes
// app.use('/users', userRoutes);
// app.use('/', authController)
//  app.use('/', indexRouter);
// app.use('/', dashboard);
// app.use('/', loginRouter);
// app.use('/', signupRouter); 
// app.use('/notes', notesRouter);
// app.use('/', userRoute);


// ...


export default app;







