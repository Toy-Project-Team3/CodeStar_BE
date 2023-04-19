import { myDataBase } from '../../db';
import { Post } from '../entity/Post';
import { User } from '../entity/User';
import { JwtRequest } from '../interface/interfaces';
import { Response } from 'express';

export class PostController {
  static createPost = async (req: JwtRequest, res: Response) => {
    const { title, content } = req.body;
    const { id: userId } = req.decoded;

    const user = await myDataBase.getRepository(User).findOne({
      where: { id: userId },
    });

    const post = new Post();
    post.title = title;
    post.content = content;
    post.author = user;

    const result = await myDataBase.getRepository(Post).insert(post);
    res.status(201).send(result);
  };
}
