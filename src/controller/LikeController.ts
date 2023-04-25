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
          user: { userId: req.body.userId },
          post: { postId: req.params.postId },
          credit: { creditScoreId: req.params.creditScore },
        },
      });
  
      if (!isExist) {
        const post = await myDataBase.getRepository(Post).findOneBy({
          postId: req.params.postId,
        });
        const user = await myDataBase.getRepository(User).findOneBy({
          userId: req.params.userId,
        });
        const credit = await myDataBase.getRepository(Credit).findOneBy({
          creditScoreId: req.params.creditScoreId,
        });
        const like = new Like();
        like.post = post;
        like.user = user;
        like.credit = credit;
        await myDataBase.getRepository(Like).insert(like);
  
       
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
  
}
