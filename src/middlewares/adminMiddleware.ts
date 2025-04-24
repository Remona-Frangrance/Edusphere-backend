import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };
    if (decoded.role !== 'admin') throw new Error();
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token or not authorized' });
  }
};
