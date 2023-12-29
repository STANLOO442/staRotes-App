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

// authController.ts

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullname, email, gender, phone, address, password } = req.body;
    console.log('Received form data:', req.body);
    // Check if all required fields are provided
    if (!fullname || !email || !gender || !phone || !address || !password) {
      res.status(400).json({ error: 'All fields are required' });
    } else {
      // Check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Invalid email format' });
      } else {
        // Check if the email is not already registered
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          res.status(409).json({ error: 'Email is already registered. Please login.' });
        } else {
          // Save user information to the database
          const newUser = await User.create({
            fullname,
            email,
            gender,
            phone,
            address,
            password
          });

          // Hash the password before saving
          await newUser.hashPassword();
          // Save the user with the hashed password
          await newUser.save();

          res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
        }
      }
    }
  } catch (error) {
    console.error('Error signing up:', error);

    // Handle Sequelize validation error (unique constraint)
    if (error instanceof UniqueConstraintError) {
      const field = error.errors[0]?.path;
      res.status(409).json({ error: `${field} is already in use. Please choose a different value.` });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Compare the entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate JWT token upon successful login
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    // Set the token in the cookies
    res.cookie('token', token, { httpOnly: true });

    // Return the user's email, fullname, and the token
    res.status(200).json({
      email: user.email,
      fullname: user.fullname,
      token,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      res.status(400).json({ error: 'Email is already registered' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default { signup, login};

