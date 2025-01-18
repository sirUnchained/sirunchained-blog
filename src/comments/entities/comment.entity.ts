import { ArticleEntity } from 'src/articles/entities/article.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1000 })
  content: string;

  @Column({ default: false })
  accepted: boolean;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.id, {
    onDelete: 'CASCADE',
  })
  parent: CommentEntity | null;

  @ManyToOne(() => ArticleEntity, (article) => article.id, {
    onDelete: 'CASCADE',
  })
  article: ArticleEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
