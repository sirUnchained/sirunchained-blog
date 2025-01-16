import { CategoryEntity } from 'src/categories/entities/category.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @Column({ type: 'varchar', length: 250 })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  cover: string | null;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  author: UserEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.id, {
    onDelete: 'CASCADE',
  })
  category: CategoryEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
