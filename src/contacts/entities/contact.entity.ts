import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('contacts')
export class ContactEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  subject: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
