import { Router } from "express";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { CommentController } from "../controller/CommentController";

const routes = Router()

routes.get('', AuthMiddleware.verifiyToken, CommentController.getComments)

export default routes