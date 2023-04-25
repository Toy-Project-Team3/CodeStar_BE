import { Request, Response } from 'express';
import { myDataBase } from '../../db';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generanteRefreshToken, generateAccessToken, generatePassword, registerToken } from '../util/Auth';
import { JwtRequest, UploadS3Request } from '../interface/interfaces';
import { Credit } from '../entity/Credit';

dotenv.config();


export class UserController {
  static register = async (req: Request, res: Response) => {
    const { id, userId, password, userName } = req.body;

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
      return res.status(400).json({ message: '중복된 아이디와 이름입니다.' });
    }

    const user = myDataBase.getRepository(User).create({
      userId,
      password: await generatePassword(password),
      userName,
    });

    const credits = myDataBase.getRepository(Credit).create({
      creditScore: 30,
    });

    const newUser = await myDataBase.getRepository(User).save(user);
    const userCredit = await myDataBase.getRepository(Credit).save(credits);
    await myDataBase.getRepository(Credit).update(userCredit.creditScoreId, { owner: newUser });
    await myDataBase.getRepository(User).update(newUser.id, { credits });

    const accessToken = generateAccessToken(newUser.id, newUser.userId, newUser.userName);
    const refreshToken = generanteRefreshToken(newUser.id, newUser.userId, newUser.userName);
    registerToken(refreshToken, accessToken);

    const decoded = verify(accessToken, process.env.SECRET_ATOKEN);
    try {
      res.cookie('refereshToken', refreshToken, { path: '/', httpOnly: true, maxAge: 3600 * 24 * 30 * 1000 });
      res.status(201).send({ content: decoded, accessToken });
    } catch (err) {
      res.status(500).json({ message: '회원 가입 중 오류가 발생하였습니다. ' });
    }
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
      return res.status(400).json({ message: '아이디 혹은 비밀번호가 일치하지 않습니다.' });
    }

    const accessToken = generateAccessToken(user.id, user.userId, user.userName);
    const refreshToken = generanteRefreshToken(user.id, user.userId, user.userName);

    const decoded = verify(accessToken, process.env.SECRET_ATOKEN);
    try {
      res.cookie('refereshToken', refreshToken, { path: '/', httpOnly: true, maxAge: 3600 * 24 * 30 * 1000 });
      res.status(201).send({ content: decoded, accessToken });
    } catch (err) {
      res.status(500).json({ message: '로그인 실패하였습니다.' });
    }
  };

  static logout = async (req: Request, res: Response) => {
    res.clearCookie('refreshToken', { path: '/' });
    try {
      res.status(204).json({ message: '로그 아웃되었습니다.' });
    } catch (err) {
      res.status(500).json({ message: '로그 아웃을 실패하였습니다.' });
    }
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
        credits: {
          creditScore: true,
        },
        commentList: {
          commentId: true,
          content: true,
          createdAt: true,
          author: {
            id: true,
            userId: true,
            userName: true,
          },
          post: {
            postId: true,
            title: true,
            content: true,
            likes: true,
            author: {
              id: true,
              userId: true,
              userName: true,
              profileImg: true,
            },
          },
        },
      },
      relations: {
        postList: true,
        credits: true,
        likes: true,
        commentList: {
          post: {
            author: true,
          },
          author: true,
        },
      },
    });

    if (!results) {
      return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    }
    if (userId !== results.userId && id !== results.id) {
      return res.status(403).json({ message: '해당 페이지에 권한이 없습니다.' });
    }
    try {
      res.status(200).send(results);
    } catch (err) {
      res.status(500).json({ message: '마이페이지 불러오는 중 오류가 발생했습니다.' });
    }
  };

  static updateMyInfo = async (req: UploadS3Request, res: Response) => {
    const { id: id, userId: userId } = req.decoded;
    const { bio, userName } = req.body;
    const profileImg = req?.files.find(file => file.fieldname === 'profileImg');
    const thumbnail = req?.files.find(file => file.fieldname === 'thumbnail')   
    const user = await myDataBase.getRepository(User).findOne({
      where: { userId: req.params.userId },
      select: {
        bio: true,
        userName: true,
      },
    });
    if (!user.id && user.userId) {
      return res.status(401).json({ message: '접근 권한이 없습니다.' });
    }

    const newUser = new User();
    newUser.bio = bio;
    newUser.userName = userName;
    profileImg && (newUser.profileImg = profileImg.location)

    const results = await myDataBase.getRepository(User).update({ userId: req.params.userId }, newUser);
    console.log(results);
    try {
      res.status(200).json({ message: '내 정보가 수정되었습니다.' });
    } catch (err) {
      res.status(500).json({ message: '정보 변경 중 오류가 발생했습니다.' });
    }
  };
}
