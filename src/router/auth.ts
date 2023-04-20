import Router from 'express';
import { UserController } from '../controller/UserController';

const routes = Router();

routes.post('/register', UserController.register);
routes.post('/login', UserController.login);
routes.post('/logout', UserController.logout)

export default routes;
