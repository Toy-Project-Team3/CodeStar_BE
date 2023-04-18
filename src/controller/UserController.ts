import { Request, Response } from "express"
import { myDataBase } from "../../db"
import { User } from "../entity/User"
import bcrypt from 'bcrypt'
import { verify } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { generanteRefreshToken, generateAccessToken, generatePassword, registerToken } from "../util/Auth"

dotenv.config()

export class UserController {
    static register =async (req:Request, res:Response) => {
    const {userId, password, userName} = req.body     
    
    const existUser = await myDataBase.getRepository(User).findOne({
        where: [{userId}, {userName}]
    })
    if(existUser) {
        return res.status(400).json({error: 'Duplicate User'})
    }
    const user = new User()
    user.userId = userId
    user.password = await generatePassword(password)
    user.userName = userName

    const newUser = await myDataBase.getRepository(User).save(user)
    const accessToken = generateAccessToken(newUser.id, newUser.userId, newUser.userName )
    const refreshToken = generanteRefreshToken(newUser.id, newUser.userName, newUser.userId)
    registerToken(refreshToken, accessToken)
    
    const decoded = verify(accessToken, process.env.SECRET_ATOKEN)
   
    res.cookie('refereshToken', refreshToken, {path: '/', httpOnly: true, maxAge: 3600 * 24 * 30 * 1000})
    res.send({ content: decoded, accessToken, refreshToken})
 }
 static login = async (req: Request, res: Response) => {
    const {userId, password} = req.body

    const user = await myDataBase.getRepository(User).findOne({
        where: {userId}
    })
    if(!user) {
        return res.status(400).json({error: 'User not find'})
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword) {
        return res.status(400).json({error: 'Invalid Password'})
    } 

    const accessToken = generateAccessToken(user.id, user.userName, user.userId)
    const refreshToken = generanteRefreshToken(user.id, user.userName, user.userId)

    const decoded = verify(accessToken, process.env.SECRET_ATOKEN)

    res.send({content: decoded, accessToken, refreshToken})
 }

}