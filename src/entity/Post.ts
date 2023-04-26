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
import {Dislike} from './Dislike'

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
  @OneToMany(()=> Dislike, dislikes=> dislikes.post)
  dislikes: Dislike[]
  @ManyToOne(() => User, (user) => user.postList)
  author: User;
  @Column()
  thumbnail: string
  @Column({ type: 'boolean', default: false })
  isPrivate: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
