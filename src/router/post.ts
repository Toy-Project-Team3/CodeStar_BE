import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { PostController } from '../controller/PostController';

const routes = Router();

routes.post('', AuthMiddleware.verifiyToken, PostController.createPost);
routes.get('', PostController.getPosts);
routes.get('/:postId', PostController.getPost);
export default routes;
