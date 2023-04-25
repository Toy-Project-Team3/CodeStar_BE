import  multer from 'multer';
import  multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { KeyCallback } from './interface/interfaces';
import { Request } from 'express';
import dotenv from 'dotenv'

dotenv.config()


const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'seonmibucket', //버킷이름
    acl: 'public-read', // acl 정책
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: Request, file: Express.Multer.File, cb: KeyCallback) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});
