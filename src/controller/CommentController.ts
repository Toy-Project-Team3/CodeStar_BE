import { Response } from 'express';
import { myDataBase } from '../../db';
import { JwtRequest } from '../interface/interfaces';
import { Post } from '../entity/Post';
import { User } from '../entity/User';
import { Comment } from '../entity/Comment';

export class CommentController {
  static createComment = async (req: JwtRequest, res: Response) => {
    const { userId: userId } = req.decoded;
    const { content } = req.body;

    const post = await myDataBase.getRepository(Post).findOne({
      where: { title :req.params.title},
      select:{
        postId: true,
        title: true,
        content: true,
        createdAt:true,
        author: {
          id: true,
          userId: true,
          userName:true,
          profileImg: true
        }
        
      },
      relations: {
        author:true,
        commentList:true
      }
      
    });

    const user = await myDataBase.getRepository(User).findOne({
      where: { userId: userId },
      select:{
        id: true,
        userId: true,
        userName: true,
        profileImg: true,
        commentList: true,
        postList:true,
      },
      relations: {
        postList: true,
        commentList:true
      }
    });

    const comment = new Comment();
    comment.content = content;
    comment.post = post;
    comment.author = user;
    const results = await myDataBase.getRepository(Comment).insert(comment);
    res.status(201).json({message: '댓글 작성이 완료되었습니다.'})
  };

  static getComments = async (req: JwtRequest, res: Response) => {
    const {id: userId }= req.decoded 
    const results = await myDataBase.getRepository(Comment).find({
      select: {
        author: {
          id: true,
          userId: true,
          userName: true,
        },
      },
      relations: {
        author: true,
        post: true,
      },
    });
    try {
      if(!userId){

        res.status(200).send(results);
      }
    } catch (err) {
      res.status(404).json({ message: '댓글들을 찾을 수 없습니다.' });
    }
  };

  static updateComment = async(req: JwtRequest, res: Response) => {
    const {id: userId} = req.decoded
    const { content, commentId } = req.body
  

   
    const post = await myDataBase.getRepository(Post).findOne({
      where: { title :req.params.title},
      select:{
        postId: true,
        title: true,
        content: true,
        createdAt:true,
        author: {
          id: true,
          userId: true,
          userName:true,
          profileImg: true
        },
      },
      relations: {
        author:true,
        commentList:true
      }
    });
    if (!post) {
      return res.status(404).json({ message: '해당 게시물을 찾을 수 없습니다.' });
    }
    if (!userId) {
      return res.status(401).json({ message: '댓글 작성자 본인이 아닙니다.' });
    }

    const comment = await myDataBase.getRepository(Comment).findOne({where:{commentId:commentId}});

    const newComment = new Comment()
    newComment.content = content

    console.log(newComment);
    if(comment) {

      const results = await myDataBase.getRepository(Comment).update({commentId: comment.commentId}, newComment)
    }
    try {
      res.status(200).json({ message: '댓글이 수정되었습니다.' });
    } catch (err) {
      res.status(500).json({ message: '댓글 작성 중 오류가 발생했습니다.' });
    }
  }

  static deleteComment = async(req: JwtRequest, res: Response) => {
    const {id: userId} = req.decoded
    const currentComment = await myDataBase.getRepository(Comment).findOne({
      where:{commentId: req.params.commentId},
    })

    const results = await myDataBase.getRepository(Comment).delete(currentComment.commentId)
    if(userId === currentComment.author.id){

      return res.status(204).json({message: '댓글 삭제가 완료되었습니다.'})
    }
  }
}
