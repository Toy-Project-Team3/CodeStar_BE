import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  postId: string;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column()
  codeContent: string;
  @ManyToMany((type) => User, (user) => user.postList)
  author: User;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
