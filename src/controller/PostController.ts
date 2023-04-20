import { myDataBase } from '../../db';
import { Post } from '../entity/Post';
import { User } from '../entity/User';
import { JwtRequest } from '../interface/interfaces';
import { Response, Request } from 'express';

export class PostController {
  static createPost = async (req: JwtRequest, res: Response) => {
    const { title, content, tags } = req.body;
    const { id: userId } = req.decoded;

    const user = await myDataBase.getRepository(User).findOne({
      where: { id: userId },
    });

  if(!title&& !content) {
    return res.status(400).json({ message: '게시글 제목과 내용을 입력해주세요.' })
  }


    const post = new Post();
    post.title = title;
    post.content = content;
    post.author = user;
    post.tags = tags;

    const result = await myDataBase.getRepository(Post).insert(post);
  
      res.status(201).json({ message: '게시글이 작성완료되었습니다.' });
 
  };

  static getPosts = async (req: Request, res: Response) => {
    const results = await myDataBase.getRepository(Post).find({
      select: {
        author: {
          id: true,
          userName: true,
        },
      },
      relations: {
        author: true,
      },
    });
    res.status(200).send(results);
  };
  static getPost = async (req: Request, res: Response) => {
    const results = await myDataBase.getRepository(Post).findOne({
      where: { postId: req.params.postId },
      select: {
        author: {
          id: true,
          userName: true,
        },
      },
      relations: {
        author: true,
      },
    });
    try{
      res.status(200).send(results);

    }catch (error){
      res.status(404).json({message: '해당 게시글을 찾을 수 없습니다.'})
    }
  };

  static updatePost = async (req: JwtRequest, res: Response) => {
    const { id: userId } = req.decoded;

    const currentPost = await myDataBase.getRepository(Post).findOne({
      where: { postId: req.params.postId },
      relations: {
        author: true,
      },
    });

    if (!currentPost) {
      return res.status(404).json({ message: '해당 게시물을 찾을 수 없습니다.' });
    }

    if (userId !== currentPost.author.id) {
      return res.status(401).json({ message: '작성자 본인이 아닙니다.' });
    }
    const { title, content, tags } = req.body;
    const newPost = new Post();
    newPost.title = title;
    newPost.content = content;
    newPost.tags = tags;

    const results = await myDataBase.getRepository(Post).update({ postId: req.params.postId }, newPost);
    try{

      res.status(200).json({ message: '게시글이 수정되었습니다.' });
    }catch(err) {
      res.status(500).json({message: '게시글 작성 중 오류가 발생했습니다.'})
    }
  };

  static deletePost = async (req: JwtRequest, res: Response) => {
    const { id: userId } = req.decoded;
    const currentPost = await myDataBase.getRepository(Post).findOne({
      where: { postId: req.params.postId },
      relations: {
        author: true,
      },
    });
    if (!currentPost) {
      return res.status(404).json({ message: '해당 게시물을 찾을 수 없습니다.' });
    }
    if (userId !== currentPost.author.id) {
      return res.status(401).json({ message: '작성자 본인이 아닙니다.' });
    }

    const results = await myDataBase.getRepository(Post).delete({ postId: req.params.postId });
    res.status(204).json({ message: '삭제 완료되었습니다.' });
  };
}
