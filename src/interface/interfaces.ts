import { Request } from 'express';

export interface TokenPayload {
  userId: string;
  username: string;
  id: string;
}

export interface JwtRequest extends Request {
  decoded?: TokenPayload;
}
