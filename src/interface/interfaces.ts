import { Request } from 'express';

export interface TokenPayload {
  id: string;
  userId: string;
  userName: string;
}

export interface JwtRequest extends Request {
  decoded?: TokenPayload;
}
