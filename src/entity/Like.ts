import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";
import { Credit } from "./Credit";


@Entity()
export class Like{
    @PrimaryGeneratedColumn('uuid')
    likeId: string
    @ManyToOne(()=> User, user => user.likes, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user:User
    @ManyToOne(()=> Post, post => post.likes, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    post: Post
    @ManyToOne(()=> Credit, credit => credit.likes, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    credit: Credit
}