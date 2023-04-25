import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";
import { Credit } from "./Credit";

@Entity()
export class Dislike{
    @PrimaryGeneratedColumn('uuid')
    disLikeId: string
    @ManyToOne(()=> User, user => user.likes, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user:User
    @ManyToOne(()=> Post, post => post.likes, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    post: Post
    @ManyToOne(()=> Credit, creditscore => creditscore.likes, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    credit: Credit
}