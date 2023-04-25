import { Request } from 'express';

export interface TokenPayload {
  id: string;
  userId: string;
  userName: string;
}

export interface JwtRequest extends Request {
  decoded?: TokenPayload;
}

export interface UploadS3Request extends JwtRequest {
  file?: Express.MulterS3.File;
  files?: Express.MulterS3.File[];
}
//dto 요청에 맞게 변환한다.

export interface KeyCallback {
  (error: any, key?: string):void
}