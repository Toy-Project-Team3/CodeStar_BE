import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { PostController } from '../controller/PostController';
import { CommentController } from '../controller/CommentController';



const routes = Router();

routes.post('', AuthMiddleware.verifiyToken, PostController.createPost);
routes.get('', PostController.getPosts);
routes.put('/:title', AuthMiddleware.verifiyToken, PostController.updatePost)
routes.delete('/:postId', AuthMiddleware.verifiyToken, PostController.deletePost)
routes.get('/:userId', PostController.getAuthorPosts)
routes.get('/:userId/:title', PostController.getAuthorPost);
routes.post('/:userId/:title/comments', AuthMiddleware.verifiyToken, CommentController.createComment)
routes.put('/:userId/:title/comments/:commentId', AuthMiddleware.verifiyToken, CommentController.updateComment)
routes.delete('/:userId/:title/comments/:commentId', AuthMiddleware.verifiyToken, CommentController.deleteComment)


export default routes;
