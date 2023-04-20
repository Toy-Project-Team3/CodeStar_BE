import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,

} from 'typeorm';
import { User } from './User';



@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  postId: string;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column("simple-array", { nullable: true })
  tags: string[];
  @ManyToOne(() => User, (user) => user.postList)
  author: User;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
