import Router from 'express';
import { UserController } from '../controller/UserController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
const routes = Router();

routes.post('/register', UserController.register);
routes.post('/login', UserController.login);
routes.post('/logout', UserController.logout)
routes.get('/mypage/:userName',AuthMiddleware.verifiyToken, UserController.getMyInfo)

export default routes;
