import { myDataBase } from '../../db';
import { Post } from '../entity/Post';
import { User } from '../entity/User';
import { Comment } from '../entity/Comment';
import { JwtRequest } from '../interface/interfaces';
import { Response, Request } from 'express';

export class PostController {
  /**게시글 생성*/
  static createPost = async (req: JwtRequest, res: Response) => {
    const { title, content } = req.body;
    const { id: userId } = req.decoded;

    const user = await myDataBase.getRepository(User).findOne({
      where: { id: userId },
    });

    if (title === '' && content === '') {
      return res.status(400).json({ message: '게시글 제목과 내용을 입력해주세요.' });
    }

    const post = new Post();
    post.title = title;
    post.content = content;
    post.author = user;

    const result = await myDataBase.getRepository(Post).insert(post);

    res.status(201).json({ message: '게시글이 작성완료되었습니다.' });
  };
  /** 모든 게시글 조회*/
  static getPosts = async (req: Request, res: Response) => {
    const results = await myDataBase.getRepository(Post).find({
      select: {
        author: {
          id: true,
          userId: true,
          userName: true,
          profileImg: true,
        },
      },
      relations: {
        author: true,
        commentList: true,
      },
    });
    res.status(200).send(results);
  };

  static getAuthorPosts = async (req: Request, res: Response) => {
    const user = await myDataBase.getRepository(User).findOne({
      where: { userId: req.params.userId },
      select: {
        id: true,
        userId: true,
        userName: true,
        postList: true,
        profileImg: true,
        bio: true,
        commentList: true,
        creditScore: true,
      },
      relations: {
        postList: true,
        commentList: true,
      },
    });

    const results = await myDataBase.getRepository(Post).find({
      where: { author: { userId: user.userId } },
      select: {
        postId: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          userId: true,
          userName: true,
          profileImg: true,
          creditScore: true,
          bio: true,
        },
      },
      relations: {
        author: true,
        commentList: true,
      },
    });
    console.log(res);
    try {
      res.status(200).send(results);
    } catch (err) {
      res.status(404).json({ message: '게시글들을 찾을 수 없습니다.' });
    }
  };

  static getAuthorPost = async (req: Request, res: Response) => {
    const user = await myDataBase.getRepository(User).findOne({
      where: { userId: req.params.userId },
    });
    const results = await myDataBase.getRepository(Post).findOne({
      where: { author: { userId: user.userId }, title: req.params.title },
      select: {
        author: {
          id: true,
          userId: true,
          userName: true,
          profileImg: true,
          creditScore: true,
        },
        commentList: {
          commentId: true,
          content: true,
          createdAt: true,
          author: {
            id: true,
            userId: true,
            userName: true,
            profileImg: true,
          },
        },
      },
      relations: {
        author: true,
        commentList: {
          author: true,
        },
      },
    });

    try {
      res.status(200).send(results);
    } catch (err) {
      res.status(404).json({ message: '게시글들을 찾을 수 없습니다.' });
    }
  };
  /**게시글 수정*/
  static updatePost = async (req: JwtRequest, res: Response) => {
    const { userId: userId } = req.decoded;
    const { title, content } = req.body;
    const user = await myDataBase.getRepository(User).findOne({
      where: { userId: req.params.userId },
    });
    const currentPost = await myDataBase.getRepository(Post).findOne({
      where: { author: { userId: user.userId }, title: req.params.title },
      select: {
        author: {
          id: true,
          userId: true,
          userName: true,
        }
      },
      relations: {
        author: true,
      },
    });
    if (!currentPost) {
      return res.status(404).json({ message: '해당 게시물을 찾을 수 없습니다.' });
    }

    if (userId !== currentPost.author.userId) {
      return res.status(401).json({ message: '작성자 본인이 아닙니다.' });
    }
    const newPost = new Post();
    newPost.title = title;
    newPost.content = content;
  

    const results = await myDataBase.getRepository(Post).update({ title: req.params.title }, newPost);
    console.log(results);
    try {
      res.status(200).json({ message: '게시글이 수정되었습니다.' });
    } catch (err) {
      res.status(500).json({ message: '게시글 작성 중 오류가 발생했습니다.' });
    }
  };

  static deletePost = async (req: JwtRequest, res: Response) => {
    const { id: userId } = req.decoded;
    
    const currentPost = await myDataBase.getRepository(Post).findOne({
      where: { postId: req.params.postId },
      select:{
        author:{
          id: true,
          userId: true,
          userName: true,
        }
      },
      relations: {
        author: true,
      },
    });
    const postComment = await myDataBase.getRepository(Comment).find({
      where: { post: currentPost },
    });
    await myDataBase.getRepository(Comment).remove(postComment);
    console.log(postComment);
    if (!currentPost) {
      return res.status(404).json({ message: '해당 게시물을 찾을 수 없습니다.' });
    }
    if (userId !== currentPost.author.id) {
      return res.status(401).json({ message: '게시글 작성자 본인이 아닙니다.' });
    }
    console.log(currentPost);
    const results = await myDataBase.getRepository(Post).delete(currentPost.postId);
    res.status(204).json({ message: '게시글 삭제 완료되었습니다.' });
  };
}
