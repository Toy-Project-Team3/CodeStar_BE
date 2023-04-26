import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { PostController } from '../controller/PostController';
import { CommentController } from '../controller/CommentController';
import { LikeController } from '../controller/LikeController';
import { DisLikeController } from '../controller/DisLikeController';
import {upload} from '../uploadS3'
// const { upload } = require('../uploadS3')

const routes = Router();

routes.get('', PostController.getPosts);
routes.post('', upload.any(), AuthMiddleware.verifiyToken, PostController.createPost);
routes.put('/:postId',upload.any(), AuthMiddleware.verifiyToken, PostController.updatePost)
routes.delete('/:postId', AuthMiddleware.verifiyToken, PostController.deletePost)
routes.get('/:userId', PostController.getAuthorPosts)
routes.get('/:userid/:postId', PostController.getAuthorPost);
routes.post('/:userId/:postId/like',AuthMiddleware.verifiyToken, LikeController.likePost);
routes.post('/userId/:postId/dislike',AuthMiddleware.verifiyToken, DisLikeController.dislikePost);
routes.post('/:userId/:postId/comments', AuthMiddleware.verifiyToken, CommentController.createComment)
routes.put('/:userId/:postId/comments/:commentId', AuthMiddleware.verifiyToken, CommentController.updateComment)
routes.delete('/:userId/:postId/comments/:commentId', AuthMiddleware.verifiyToken, CommentController.deleteComment)


export default routes;
