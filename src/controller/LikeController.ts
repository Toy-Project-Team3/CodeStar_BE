import { Like } from '../../src/entity/Like';
import { myDataBase } from '../../db';
import { JwtRequest } from '../interface/interfaces';
import { Response } from 'express';
import { Post } from '../entity/Post';
import { User } from '../entity/User';
import { Credit } from '../entity/Credit';

export class LikeController {
  static likePost = async (req: JwtRequest, res: Response) => {
    try {
      const isExist = await myDataBase.getRepository(Like).findOne({
        where: {
          user: { id: req.body.id },
          post: { postId: req.params.postId },
          credit: { creditScoreId: req.params.creditScoreId },
        },
      });
  
      if (!isExist) {
        const post = await myDataBase.getRepository(Post).findOneBy({
          postId: req.params.postId,
        });
        const user = await myDataBase.getRepository(User).findOneBy({
          id: req.params.id,
        });
        const credit = await myDataBase.getRepository(Credit).findOneBy({
          creditScoreId: req.params.creditScoreId,
        });
        const like = new Like();
        like.post = post;
        like.user = user;
        like.credit = credit;
        await myDataBase.getRepository(Like).insert(like);
        console.log(like)
       
        const creditScore = await myDataBase
          .getRepository(Credit)
          .findOne({ where: { creditScoreId: req.params.creditScoreId } });
  
        credit.creditScore += 5;
        await myDataBase.getRepository(Credit).save(credit);
  
        return res.status(200).json({ message: "좋아요가 등록되었습니다." });
      } else {
        await myDataBase.getRepository(Like).remove(isExist);
  
        // 신뢰도 내리는 로직 추가
        const credit = await myDataBase
          .getRepository(Credit)
          .findOne({ where: { creditScoreId: req.params.creditScoreId } });
  
        credit.creditScore -= 5;
        await myDataBase.getRepository(Credit).save(credit);
  
        return res.status(200).json({ message: "좋아요가 삭제되었습니다." });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
  };

  static getLikePost = async(req: JwtRequest, res: Response) => {
    const {id} = req.decoded
    const user = await myDataBase.getRepository(User).findOne({
      where: { id: req.params.id },
    
    });

    const results = await myDataBase.getRepository(Like).findOne({
      where: {user: {id: user.id}},
      select: {
        post: {
          postId: true,
          title: true,
          content: true,
          author:{
            id: true,
            userId: true,
            userName: true
          },

        }
      },
      relations: {
        user: true,
        post: true
      }

    })

    
    if(id !== results.user.id){

      res.status(404).json({ message: '해당 포스트를 찾을 수 없습니다.' });
    }
   try {
    if(id === results.user.id)
       res.status(200).send(results);
     
   } catch (err) {
     res.status(500).json({message: '포스트 조회중 오류가 발생하였습니다.'})
   }

  }
  
}
