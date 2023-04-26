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
routes.get('/:id', PostController.getAuthorPosts)
routes.get('/:id/:postId', PostController.getAuthorPost);
routes.get('/:id/:postId/like',AuthMiddleware.verifiyToken, LikeController.getLikePost);
routes.post('/:id/:postId/like',AuthMiddleware.verifiyToken, LikeController.likePost);
routes.post('/:id/:postId/dislike',AuthMiddleware.verifiyToken, DisLikeController.dislikePost);
routes.post('/:id/:postId/comments', AuthMiddleware.verifiyToken, CommentController.createComment)
routes.put('/:id/:postId/comments/:commentId', AuthMiddleware.verifiyToken, CommentController.updateComment)
routes.delete('/:id/:postId/comments/:commentId', AuthMiddleware.verifiyToken, CommentController.deleteComment)


export default routes;
