import Router from 'express';
import { UserController } from '../controller/UserController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import {upload} from '../uploadS3'
const routes = Router();

routes.post('/register', UserController.register);
routes.post('/login', UserController.login);
routes.post('/logout', UserController.logout)
routes.get('/mypage/:userId',AuthMiddleware.verifiyToken, UserController.getMyInfo)
routes.put('/mypage/:userId', upload.any(), AuthMiddleware.verifiyToken, UserController.updateMyInfo)


export default routes;