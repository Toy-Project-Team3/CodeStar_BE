import { Request, Response } from "express"
import { myDataBase } from "../../db"
import { User } from "../entity/User"
import bcrypt from 'bcrypt'
import { verify } from 'jsonwebtoken'
import { generanteRefreshToken, generateAccessToken, generatePassword, registerToken } from "../util/Auth"

export class UserController {
    static register =async (req:Request, res:Response) => {
    const {userId, password, username} = req.body     
    
    const existUser = await myDataBase.getRepository(User).findOne({
        where: [ {userId}, {username}]
    })
    if(existUser) {
        return res.status(400).json({error: 'Duplicate User'})
    }
    const user = new User()
    user.userId = userId
    user.password = await generatePassword(password)
    user.username = username

    const newUser = await myDataBase.getRepository(User).save(user)
    const accessToken = generateAccessToken(newUser.id, newUser.userId, newUser.username )
    const refreshToken = generanteRefreshToken(newUser.id, newUser.username, newUser.userId)
    registerToken(refreshToken, accessToken)
    const decoded = verify(accessToken, process.env.SECRET_ATOKEN)
    res.send({ content: decoded, accessToken, refreshToken})
 }
}