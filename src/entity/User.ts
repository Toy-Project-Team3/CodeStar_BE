import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Post } from './Post';
import { Comment } from './Comment';
import { Like } from './Like';

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
  @Column()
  creditScore: number;
  @OneToMany(() => Post, (post) => post.author) //,{ cascade: ["insert", "update", 'remove'] }
  postList: Post[];
  @OneToMany(() => Comment, (comment) => comment.author)
  commentList: Comment[];
  @OneToMany(() => Like, (likes) => likes.user)
  likes: Like[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
