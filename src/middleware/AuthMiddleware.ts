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
      return res.status(403).json({message: '접근이 불가능합니다.'});
    }
    try {
      const decoded = verify(token, process.env.SECRET_ATOKEN) as TokenPayload;
      req.decoded = decoded;
    } catch (err) {
      return res.status(401).json({message: '로그인이 필요합니다.'});
    }
    return next();
  };
}
