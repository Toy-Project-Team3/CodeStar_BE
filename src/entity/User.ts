import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Post } from './Post';

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
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
