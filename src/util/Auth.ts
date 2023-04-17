import jwt  from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import { tokenList } from '../app';

export const generatePassword = async (pw: string) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(pw, salt);
  return password;
};

export const generateAccessToken = (id: string, username: string, userId: string) => {
    return jwt.sign(
        { id, username, userId },
        process.env.SECRET_ATOKEN,
        {expiresIn: '1h'}
    )
};

export const generanteRefreshToken = (id: string, username: string, userId:string ) => {
    return jwt.sign(
        {id: id, username:username, userId:userId},
        process.env.SECRET_RTOKEN,
        {expiresIn: '30d'}
        )
}

export const registerToken = (refreshToken: string, accessToken: string) => {
    tokenList[refreshToken] = {
        status: 'loggedin',
        accessToken: accessToken,
        refreshToken: refreshToken,
    }
}

export const removeToken = (refresToken: string) => {
    delete tokenList[refresToken]
}