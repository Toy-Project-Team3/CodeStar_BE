import { DataSource } from "typeorm"
import dotenv from 'dotenv'

dotenv.config()



export const myDataBase = new DataSource({
    type: "mysql",
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_POST),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE, // db 이름
    entities: [process.env.NODE_ENV ==='production'?'dist/src/entity/*.js':"src/entity/*.ts"], // 모델의 경로
    logging: true, // 정확히 어떤 sql 쿼리가 실행됐는지 로그 출력
    synchronize: true,
})