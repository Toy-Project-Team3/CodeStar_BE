import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Post } from './Post';
import { Comment } from './Comment';
import { Like } from './Like';
import { Dislike } from './Dislike';
import { Credit } from './Credit';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  userId: string;
  @Column({ unique: true })
  userName: string;
  @Column()
  password: string;
  @Column()
  profileImg: string;
  @Column()
  bio: string;
  @OneToMany(() => Post, (post) => post.author) //,{ cascade: ["insert", "update", 'remove'] }
  postList: Post[];
  @OneToMany(() => Comment, (comment) => comment.author)
  commentList: Comment[];
  @OneToMany(() => Like, (likes) => likes.user)
  likes: Like[];
  @OneToMany(() => Dislike, (dislikes) => dislikes.user)
  dislikes: Dislike[];
  @OneToOne(() => Credit, (credit) => credit.owner, { cascade: true })
  @JoinColumn()
  credits: Credit;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
