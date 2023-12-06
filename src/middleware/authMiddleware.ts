// authController.ts
// authMiddleware.ts
// authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/db.config';
import User  from '../model/user';

declare module 'express' {
  interface Request {
    user?: { id: string }; // Add other user properties as needed
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.error('Authorization token is missing'); res.status(401).json({ error: 'Authorization token is missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      console.error('User not found');
      res.status(401).json({ error: 'User not found' });
      return ;
    }

    req.user = { id: user.id }; // Add other user properties as needed
    next();
  } catch (error) {
    console.error(error);

    if (error instanceof jwt.TokenExpiredError) {
      console.error('Authorization token has expired');
      res.status(401).json({ error: 'Authorization token has expired' });
      return ;
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('Invalid authorization token');
      res.status(401).json({ error: 'Invalid authorization token' });
      return 
    } else {
      console.error('Authorization failed');
      res.status(401).json({ error: 'Authorization failed' });
      return ;
    }
  }
};


// You can add more middleware functions as needed

