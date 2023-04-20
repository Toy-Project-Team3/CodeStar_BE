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
   
    res.send(results);
  };

  static updatePost = async (req: JwtRequest, res: Response) => {
    const {id: userId} = req.decoded

    const currentPost = await myDataBase.getRepository(Post).findOne({
      where: {postId: req.params.postId},
      relations: {
        author: true
      }
    })
    
    if (!currentPost) {
      return res.status(404).send("Post not found");
    }

    if(userId !== currentPost.author.id) {
      return res.status(401).send('No Permission')
    }
    const {title, content, tags} = req.body
    const newPost = new Post()
    newPost.title = title
    newPost.content = content 
    newPost.tags = tags

    const results = await myDataBase.getRepository(Post).update({postId:req.params.postId},newPost)
    res.send({message:"게시글이 수정되었습니다."})
  }

  static deletePost = async (req: JwtRequest, res: Response) => {
    const { id: userId } = req.decoded;
    const currentPost = await myDataBase.getRepository(Post).findOne({
      where: { postId: req.params.postId },
      relations: {
        author: true,
      },
    });
    if (!currentPost) {
      return res.status(404).send("해당 ID의 게시물을 찾을 수 없습니다.");
    }
    if (userId !== currentPost.author.id) {
      return res.status(401).send("작성자 본인이 아닙니다.");
    }
   
      const results = await myDataBase.getRepository(Post).delete({postId:req.params.postId});
      res.status(204).send({message: "삭제 완료되었습니다."})
    
  };
}
