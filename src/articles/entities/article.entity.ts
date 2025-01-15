import { CategoryEntity } from 'src/categories/entities/category.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, unique: true })
  slug: string;

  @Column({ type: 'string', length: 250 })
  description: string;

  @Column({ type: 'string', nullable: true })
  cover: string;

  @Column({ type: 'text' })
  content: string;

  @OneToMany(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  author: UserEntity;

  @OneToMany(() => CategoryEntity, (category) => category.id, {
    onDelete: 'CASCADE',
  })
  category: CategoryEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
