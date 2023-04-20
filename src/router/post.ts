import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { PostController } from '../controller/PostController';

const routes = Router();

routes.post('', AuthMiddleware.verifiyToken, PostController.createPost);
routes.get('', PostController.getPosts);
routes.get('/:postId', PostController.getPost);
routes.put('/:postId', AuthMiddleware.verifiyToken, PostController.updatePost)
routes.delete('/:postId', AuthMiddleware.verifiyToken, PostController.deletePost)
export default routes;
