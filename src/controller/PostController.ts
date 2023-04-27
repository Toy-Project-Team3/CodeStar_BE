import { myDataBase } from '../../db';
import { Post } from '../entity/Post';
import { User } from '../entity/User';
import { Comment } from '../entity/Comment';
import { Like } from '../entity/Like';
import { Dislike } from '../entity/Dislike';
import { JwtRequest } from '../interface/interfaces';
import { Response, Request } from 'express';
import { UploadS3Request} from '../interface/interfaces'

export class PostController {
  /**게시글 생성*/
  static createPost = async (req:UploadS3Request, res:Response) => {
    const { title, content, isPrivate } = req.body;
    console.log(req)
    const { id: id } = req.decoded;
  
    
    const profileImg = req?.files.find(file => file.fieldname === 'profileImg');
    const thumbnail = req?.files.find(file => file.fieldname === 'thumbnail')   

    const user = await myDataBase.getRepository(User).findOne({
      where: { id: id },
    });

    if (title === '' && content === '') {
      return res.status(400).json({ message: '게시글 제목과 내용을 입력해주세요.' });
    }

    const post = new Post();
    post.title = title;
    post.content = content;
    post.isPrivate = (isPrivate === 'true');
    post.author = user;
    thumbnail && (post.thumbnail = thumbnail.location)
    
    const result = await myDataBase.getRepository(Post).insert(post);

    res.status(201).json({ message: '게시글이 작성완료되었습니다.' });
  };
  /** 모든 게시글 조회*/
  static getPosts = async (req: Request, res: Response) => {
    
    const results = await myDataBase.getRepository(Post).find({
      where:{isPrivate: false},
      select: {
        postId: true,
        title: true,
        content: true,
        isPrivate: true,
        likes: true,
        thumbnail:true,
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
        likes: true
      },
    });
    try{

      res.status(200).send(results);
    }catch(err) {
      res.status(500).json({message: '게시글들을 찾을수 없습니다.'})
    }
  };

  static getAuthorPosts = async (req: Request, res: Response) => {
  
    const user = await myDataBase.getRepository(User).findOne({
      where: { id: req.params.id },
      select: {
        id: true,
        userId: true,
        userName: true,
        postList: true,
        profileImg: true,
        bio: true,
        createdAt:true,
        updatedAt: true,
        commentList: true,
        credits: {
          creditScoreId: true,
          creditScore: true,
        },
      },
      relations: {
        postList: true,
        commentList: true,
        credits: true,
      },
    });
  
    const results = await myDataBase.getRepository(Post).find({
      where: { author: { id: user.id }},
      select: {
        postId: true,
        title: true,
        content: true,
        createdAt: true,
        likes: true,
        isPrivate: true,
        thumbnail: true,
        author: {
          id: true,
          userId: true,
          userName: true,
          profileImg: true,
          bio: true,
          credits: {
            creditScoreId: true,
            creditScore: true,
          },
        },
      },
      relations: {
        author: {
          credits: true,
        },
        commentList: true,
        likes: true
      },
    });

    const filteredResults = results.filter(post => {
      return !post.isPrivate || post.author.id === user.id;
    });
    if(!filteredResults) {
      res.status(404).json({ message: '게시글들을 찾을 수 없습니다.' });
    }
  
    try {
      res.status(200).send(filteredResults);
    } catch (err) {
      res.status(500).json({ message: '블로그 조회 중 오류가 발생하였습니다.' });
    }
  };

  static getAuthorPost = async (req: Request, res: Response) => {
   
    const user = await myDataBase.getRepository(User).findOne({
      where: { id: req.params.id },
      relations: {
        credits: true,
      
      },
    });
    const results = await myDataBase.getRepository(Post).findOne({
      where: { author: { id: user.id }, postId: req.params.postId },
      select: {
        postId: true,
        title: true,
        content: true,
        likes:true,
        dislikes: true,
        isPrivate:true,
        thumbnail: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          userId: true,
          userName: true,
          profileImg: true,
          credits: {
            creditScoreId: true,
            creditScore: true,
          },
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
        dislikes:true,
        likes:true,
        author: {
          credits: true,
        },
        commentList: {
          author: true,
        },
      },
    });

    if (results.isPrivate) {
      // 요청한 유저가 게시글 작성자이거나 관리자인 경우에만 조회 가능
      if ( user.id === results.author.id ) {
        res.status(200).send(results);
        return;
      } else {
        res.status(403).json({ message: '해당 게시글은 비공개 상태입니다.' });
        return;
      }
    }

    try {
      res.status(200).send(results);
    } catch (err) {
      res.status(404).json({ message: '게시글들을 찾을 수 없습니다.' });
    }
  };
  /**게시글 수정*/
  static updatePost = async (req: UploadS3Request, res: Response) => {
    const {id: id } = req.decoded;
    const { title, content, isPrivate } = req.body;

    const profileImg = req?.files.find(file => file.fieldname === 'profileImg');
    const thumbnail = req?.files.find(file => file.fieldname === 'thumbnail') 
    
    const user = await myDataBase.getRepository(User).findOne({
      where: { id: req.params.id },
    });
    const currentPost = await myDataBase.getRepository(Post).findOne({
      where: { author: { id: user.id }, postId: req.params.postId },
      select: {
        postId: true,
        author: {
          id: true,
          userId: true,
          userName: true,
        },
      },
      relations: {
        author: true,
      },
    });
    if (!currentPost) {
      return res.status(404).json({ message: '해당 게시물을 찾을 수 없습니다.' });
    }
    if (id !== currentPost.author.id) {
      return res.status(401).json({ message: '작성자 본인이 아닙니다.' });
    }
    const newPost = new Post();
    newPost.title = title;
    newPost.content = content;
    newPost.isPrivate = isPrivate
    thumbnail && (newPost.thumbnail = thumbnail.location)
    
    const results = await myDataBase.getRepository(Post).update({ postId: req.params.postId }, newPost);
    try {
      res.status(200).json({ message: '게시글이 수정되었습니다.' });
    } catch (err) {
      res.status(500).json({ message: '게시글 작성 중 오류가 발생했습니다.' });
    }
  };

  static deletePost = async (req: JwtRequest, res: Response) => {
    const { id: id } = req.decoded;

    const currentPost = await myDataBase.getRepository(Post).findOne({
      where: { postId: req.params.postId },
      select: {
        postId: true,
        author: {
          id: true,
          userId: true,
          userName: true,
        },
      },
      relations: {
        author: true,
      },
    });
    const postComment = await myDataBase.getRepository(Comment).find({
      where: { post: currentPost },
    });
    await myDataBase.getRepository(Comment).remove(postComment);
    const postLike = await myDataBase.getRepository(Like).find({
      where: { post: currentPost },
    });
    await myDataBase.getRepository(Like).remove(postLike)
    const postDislike = await myDataBase.getRepository(Dislike).find({
      where: { post: currentPost },
    });
    await myDataBase.getRepository(Dislike).remove(postDislike)
    if (!currentPost) {
      return res.status(404).json({ message: '해당 게시물을 찾을 수 없습니다.' });
    }
    if (id !== currentPost.author.id) {
      return res.status(401).json({ message: '게시글 작성자 본인이 아닙니다.' });
    }
    const results = await myDataBase.getRepository(Post).delete(currentPost.postId);
    try{
      res.status(204).json({ message: '게시글 삭제 완료되었습니다.' });
    }catch(err) {
      res.status(500).json({message: '게시글 삭제 중 오류가 발생했습니다.'})
    }
  };
}
