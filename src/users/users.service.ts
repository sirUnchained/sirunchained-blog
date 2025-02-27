import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import UserRoles from '../Enums/usersEnum/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findAll(queries: { limit: number; page: number }) {
    try {
      if (isNaN(queries.limit)) {
        queries.limit = 5;
      }
      if (isNaN(queries.page)) {
        queries.page = 1;
      }

      const users = await this.userRepo.find({
        take: queries.limit,
        skip: (queries.page - 1) * queries.limit,
      });

      users.forEach((user) => delete user.password);

      return users;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      if (!id) {
        throw new NotFoundException('user not found.');
      }

      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('user not found.');
      }

      delete user.password;

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async newAuthor(id: number) {
    try {
      if (!id) {
        throw new NotFoundException('user not found.');
      }

      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('user not found.');
      }

      for (const column in user) {
        if (user[column] == null || user[column] == undefined) {
          throw new ForbiddenException(`this user ${column} is incomplete.`);
        }
      }

      user.roles = [...new Set([...user.roles, UserRoles.author])];
      await this.userRepo.save(user);
      delete user.password;

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(updateUserDto: UpdateUserDto, req: any) {
    try {
      const currentUser = req.user as any;

      for (const column in updateUserDto) {
        currentUser[column] = updateUserDto[column];
      }

      await this.userRepo.save(currentUser);
      delete currentUser.password;

      return currentUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      if (!id) {
        throw new NotFoundException('user not found.');
      }

      const result = await this.userRepo.delete(id);
      if (!result.affected) {
        throw new NotFoundException('user not found.');
      }

      return { message: 'user removed.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async ban(id: number) {
    try {
      if (!id) {
        throw new NotFoundException('user not found.');
      }

      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('user not found.');
      }

      user.isBanned = true;
      await this.userRepo.save(user);

      return { message: 'user is now banned.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async unBan(id: number) {
    try {
      if (!id) {
        throw new NotFoundException('user not found.');
      }

      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('user not found.');
      }

      user.isBanned = false;
      await this.userRepo.save(user);

      return { message: 'user is now unBanned.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
