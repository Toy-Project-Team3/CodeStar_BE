import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  postId: string;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column('simple-array', { nullable: true })
  tags: string[];
  @ManyToOne(() => User, (user) => user.postList)
  author: User;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
