"use strict";
// // signupController.ts
// import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import User from '../model/user';
// import { UniqueConstraintError } from 'sequelize';
// export const signup = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { fullname, email, gender, phone, address, password } = req.body;
//     // Check if all required fields are provided
//     if (!fullname || !email || !gender || !phone || !address || !password) {
//       res.status(400).json({ error: 'All fields are required' });
//       return;
//     }
//     // Check if email is valid
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       res.status(400).json({ error: 'Invalid email format' });
//       return;
//     }
//     // Check if the email is not already registered
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       res.status(409).json({ error: 'Email is already registered. Please login.' });
//       return;
//     }
//     // Save user information to the database
//     const newUser = await User.create({
//       fullname,
//       email,
//       gender,
//       phone,
//       address,
//       password,
//     });
//     res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
//   } catch (error) {
//     console.error('Error signing up:', error);
//     // Handle Sequelize validation error (unique constraint)
//     if (error instanceof UniqueConstraintError) {
//       const field = error.errors[0]?.path;
//       res.status(409).json({ error: `${field} is already in use. Please choose a different value.` });
//       return;
//     }
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// export const login = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, password } = req.body;
//     // Check if email and password are provided
//     if (!email || !password) {
//       res.status(400).json({ error: 'Email and password are required' });
//       return;
//     }
//     // Find the user with the provided email
//     const user = await User.findOne({ where: { email } });
//     // Check if the user exists
//     if (!user) {
//       res.status(401).json({ error: 'Invalid email or password' });
//       return;
//     }
//     // Check if the provided password matches the stored password
//     const isValidPassword = true; // Implement your logic to check password validity
//     if (!isValidPassword) {
//       res.status(401).json({ error: 'Invalid email or password' });
//       return;
//     }
//     // Return the appropriate status code
//     res.sendStatus(200);
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// export default signup
