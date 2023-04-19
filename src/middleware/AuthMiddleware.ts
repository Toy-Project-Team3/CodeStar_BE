import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JwtRequest, TokenPayload } from '../interface/interfaces';
dotenv.config();

export class AuthMiddleware {
  static verifiyToken = (req: JwtRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
   
    if (!token) {
      return res.status(403).send('A token is required');
    }
    try {
      const decoded = verify(token, process.env.SECRET_ATOKEN) as TokenPayload;
      req.decoded = decoded;
    } catch (err) {
      return res.status(401).send('Invalid Token');
    }
    return next();
  };
}
