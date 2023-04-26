import { Dislike } from '../../src/entity/Dislike';
import { myDataBase } from '../../db';
import { JwtRequest } from '../interface/interfaces';
import { Response } from 'express';
import { Post } from '../entity/Post';
import { User } from '../entity/User';
import { Credit } from '../entity/Credit';

export class DisLikeController {
  static dislikePost = async (req: JwtRequest, res: Response) => {
    try {
      const isExist = await myDataBase.getRepository(Dislike).findOne({
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
        const dislike = new Dislike();
        dislike.post = post;
        dislike.user = user;
        dislike.credit = credit;
        await myDataBase.getRepository(Dislike).insert(dislike);
       console.log(dislike)
        const creditScore = await myDataBase
          .getRepository(Credit)
          .findOne({ where: { creditScoreId: req.params.creditScoreId } });

        credit.creditScore -= 1;
        await myDataBase.getRepository(Credit).save(credit);

        return res.status(200).json({ message: '도움이 안 됨이 등록되었습니다.' });
      } else {
        await myDataBase.getRepository(Dislike).remove(isExist);

        // 신뢰도 내리는 로직 추가
        const credit = await myDataBase
          .getRepository(Credit)
          .findOne({ where: { creditScoreId: req.params.creditScoreId } });

        credit.creditScore += 1;
        await myDataBase.getRepository(Credit).save(credit);

        return res.status(200).json({ message: '도움이 안 됨이 삭제되었습니다.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
  };
}
