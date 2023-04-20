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

    const post = new Post();
    post.title = title;
    post.content = content;
    post.author = user;
    post.tags = tags;

    const result = await myDataBase.getRepository(Post).insert(post);
    res.status(201).send(result);
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
    res.send(results);
  };
  static getPost = async (req: Request, res: Response) => {
    const results = await myDataBase.getRepository(Post).findOne({
      where: { postId: req.params.id },
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
    res.send(results);
  };
}
