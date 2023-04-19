import { Router } from 'express';
import { AuthMiddleware } from '../src/middleware/AuthMiddleware';
import { PostController } from '../src/controller/PostController';

const routes = Router();

routes.post('', AuthMiddleware.verifiyToken, PostController.createPost);
routes.get('', PostController.getPosts)
export default routes;
