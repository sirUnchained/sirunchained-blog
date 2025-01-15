import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, unique: true })
  slug: string;
}
