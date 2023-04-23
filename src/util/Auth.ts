import jwt  from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import { tokenList } from '../app';

dotenv.config()

export const generatePassword = async (pw: string) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(pw, salt);
  return password;
};

export const generateAccessToken = (id: string,  userId: string, userName: string) => {
    return jwt.sign(
        { id,  userId, userName},
        process.env.SECRET_ATOKEN,
        {expiresIn: '1h'}
    )
};

export const generanteRefreshToken = (id: string, userId:string,  userName: string ) => {
    return jwt.sign(
        {id, userId, userName},
        process.env.SECRET_RTOKEN,
        {expiresIn: '30d'}
        )
}

export const registerToken = (  refreshToken: string, accessToken: string) => {
    tokenList[refreshToken] = {
        refreshToken,
        accessToken,
    }
}

export const removeToken = (refresToken: string) => {
    delete tokenList[refresToken]
}