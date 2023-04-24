import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';
import { Like } from './Like';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  postId: string;
  @Column()
  title: string;
  @Column()
  content: string;
  @OneToMany(()=> Comment, (comment)=> comment.post,  { cascade: true } )
  commentList: Comment[]
  @OneToMany(()=> Like, likes=> likes.post)
  likes: Like[]
  @ManyToOne(() => User, (user) => user.postList)
  author: User;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
