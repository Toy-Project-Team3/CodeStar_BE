import { Request, Response } from 'express';
import { myDataBase } from '../../db';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generanteRefreshToken, generateAccessToken, generatePassword, registerToken } from '../util/Auth';
import { JwtRequest } from '../interface/interfaces';

dotenv.config();

export class UserController {
  static register = async (req: Request, res: Response) => {
    const { userId, password, userName } = req.body;

    const userIdRegx = /^[a-zA-Z0-9]{4,16}$/.test(userId);
    if (!userIdRegx) {
      return res.status(400).json({
        message: 'ID는 숫자와 영문 대소문자 4~16자까지만 가능합니다.',
      });
    }

    const userNameRegex = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣._-]{1,20}$/;
    if (!userNameRegex.test(userName)) {
      return res.status(400).json({ message: '유효한 닉네임이 아닙니다.' });
    }

    const existUser = await myDataBase.getRepository(User).findOne({
      where: [{ userId }, { userName }],
    });
    if (existUser) {
      return res.status(400).json({ message: '이미 가입된 회원입니다.' });
    }
    const user = new User();
    user.userId = userId;
    user.password = await generatePassword(password);
    user.userName = userName;

    const newUser = await myDataBase.getRepository(User).save(user);
    const accessToken = generateAccessToken(newUser.id, newUser.userId, newUser.userName);
    const refreshToken = generanteRefreshToken(newUser.id, newUser.userId, newUser.userName);
    registerToken(refreshToken, accessToken);

    const decoded = verify(accessToken, process.env.SECRET_ATOKEN);

    res.cookie('refereshToken', refreshToken, { path: '/', httpOnly: true, maxAge: 3600 * 24 * 30 * 1000 });
    res.send({ content: decoded, accessToken });
  };
  static login = async (req: Request, res: Response) => {
    const { userId, password } = req.body;

    const user = await myDataBase.getRepository(User).findOne({
      where: { userId },
    });

    if (!user) {
      return res.status(400).json({ message: '회원가입이 되어있지 않습니다.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: '아이디나 비밀번호가 일치하지 않습니다.' });
    }

    const accessToken = generateAccessToken(user.id, user.userId, user.userName);
    const refreshToken = generanteRefreshToken(user.id, user.userId, user.userName);

    const decoded = verify(accessToken, process.env.SECRET_ATOKEN);
    res.cookie('refereshToken', refreshToken, { path: '/', httpOnly: true, maxAge: 3600 * 24 * 30 * 1000 });
    res.send({ content: decoded, accessToken });
  };

  static logout = async (req: Request, res: Response) => {
    res.clearCookie('refreshToken', { path: '/' });
    res.status(204).json({ message: '로그 아웃되었습니다.' });
  };

  static getMyInfo = async (req: JwtRequest, res: Response) => {
    const { id: id, userId: userId } = req.decoded;

    const results = await myDataBase.getRepository(User).findOne({
      where: { userId: userId },
      select: {
        id: true,
        userId: true,
        userName: true,
        profileImg: true,
        bio: true,
        creditScore: true,
        commentList:{
        commentId: true,
         content: true,
         createdAt: true,
            author: {
              id: true,
              userId: true,
              userName: true,
            }, 
            post: {
              postId:true,
              title: true,
              content: true,
              author: {
                id: true,
                userId:true,
                userName:true,
                profileImg: true,
              }
            }

        },
      },
      relations: {
        postList: true,
        commentList: {
          post:{
            author:true
          },
          author:true
        },
      },
    });

    if (!results) {
      return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    }
    if (userId !== results.userId && id !== results.id) {
      return res.status(403).json({ message: '해당 페이지에 권한이 없습니다.' });
    }

    return res.status(200).send(results);
  };
}
