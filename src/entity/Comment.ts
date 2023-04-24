import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    commentId: string
    @Column()
    content: string
    @ManyToOne(()=> Post, post => post.commentList, { onDelete: 'CASCADE' })
    post:Post
    @ManyToOne(()=> User, (user) => user.commentList)
    author: User
    @CreateDateColumn()
    createdAt:Date
    @UpdateDateColumn()
    updatedAt:Date
}