// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/db.config';
import User from '../model/user';

interface AuthenticatedUser {
  id: string;
  [key: string]: any; // Allow any additional user properties
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get the token from the cookies
  const token = req.cookies.token;

  // console.log('Token:', token);

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

    // Include user properties in req.user
    req.user = {
      id: user.id,
      ...user.get(), // Get all user properties
    } as AuthenticatedUser;

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
