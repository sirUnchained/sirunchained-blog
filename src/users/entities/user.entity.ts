import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import UserRoles from '../usersEnum/roles.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ default: 'no bio yet.' })
  bio: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    array: true,
    default: [UserRoles.user],
  })
  roles: UserRoles[];
}
