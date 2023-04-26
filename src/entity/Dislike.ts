import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";
import { Credit } from "./Credit";

@Entity()
export class Dislike{
    @PrimaryGeneratedColumn('uuid')
    dislikeId: string
    @ManyToOne(()=> User, user => user.dislikes, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user:User
    @ManyToOne(()=> Post, post => post.dislikes, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    post: Post
    @ManyToOne(()=> Credit, creditscore => creditscore.dislikes, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    credit: Credit
}