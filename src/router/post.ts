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
routes.put('/:title',upload.any(), AuthMiddleware.verifiyToken, PostController.updatePost)
routes.delete('/:postId', AuthMiddleware.verifiyToken, PostController.deletePost)
routes.get('/:userId', PostController.getAuthorPosts)
routes.get('/:userId/:title', PostController.getAuthorPost);
routes.post('/:userId/:title/like',AuthMiddleware.verifiyToken, LikeController.likePost);
routes.post('/:userId/:title/dislike',AuthMiddleware.verifiyToken, DisLikeController.dislikePost);
routes.post('/:userId/:title/comments', AuthMiddleware.verifiyToken, CommentController.createComment)
routes.put('/:userId/:title/comments/:commentId', AuthMiddleware.verifiyToken, CommentController.updateComment)
routes.delete('/:userId/:title/comments/:commentId', AuthMiddleware.verifiyToken, CommentController.deleteComment)


export default routes;
