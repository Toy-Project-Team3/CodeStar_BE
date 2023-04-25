import { Column, Entity, PrimaryGeneratedColumn,OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Like } from "./Like";
import { Dislike } from "./Dislike";
import { User } from "./User";

@Entity() 
export class Credit {
    @PrimaryGeneratedColumn('uuid')
    creditScoreId: string
    @Column({default: 30, nullable: false})
    creditScore:number
    @OneToMany(()=> Like, likes=> likes.post)
    likes: Like[]
    @OneToMany(()=> Dislike, dislikes=> dislikes.post)
    disLikes: Dislike[]
    @OneToOne(()=> User,user=>  user.credits)
    @JoinColumn()
    owner: User
  
}