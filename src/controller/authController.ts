// authController.ts

import { Request, Response, NextFunction } from 'express';
import User from '../model/user';
import bcrypt from 'bcrypt';
import { UniqueConstraintError } from 'sequelize';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/db.config';



declare module 'express' {
    interface Request {
      user?: { id: string }; // Add other user properties as needed
    }
  }

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullname, email, gender, phone, address, password } = req.body;

    // Check if all required fields are provided
    if (!fullname || !email || !gender || !phone || !address || !password) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Check if the email is not already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'Email is already registered. Please login.' });
      return;
    }

    // Save user information to the database
    const newUser = await User.create({
      fullname,
      email,
      gender,
      phone,
      address,
      password,
    });

    await newUser.hashPassword(); // Hash the password before saving
await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error('Error signing up:', error);

    // Handle Sequelize validation error (unique constraint)
    if (error instanceof UniqueConstraintError) {
      const field = error.errors[0]?.path;
      res.status(409).json({ error: `${field} is already in use. Please choose a different value.` });
      return;
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// authController.ts

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find the user with the provided email
    const user = await User.findOne({ where: { email } });

    // Check if the user exists
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Check if the provided password matches the stored password
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate JWT token upon successful login
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    // Return the user's email, fullname, and the token
    res.status(200).json({
      email: user.email,
      fullname: user.fullname,
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.error('Authorization token is missing');
    res.status(401).json({ error: 'Authorization token is missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      console.error('User not found');
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = { id: user.id }; // Add other user properties as needed
    next();
  } catch (error) {
    console.error(error);

    if (error instanceof jwt.TokenExpiredError) {
      console.error('Authorization token has expired');
      res.status(401).json({ error: 'Authorization token has expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('Invalid authorization token');
      res.status(401).json({ error: 'Invalid authorization token' });
    } else {
      console.error('Authorization failed');
      res.status(401).json({ error: 'Authorization failed' });
    }
  }
};

export default { signup, login, authenticateToken };
