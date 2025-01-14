import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import UserRoles from './usersEnum/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

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
        throw new BadRequestException('user not found.');
      }

      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException('user not found.');
      }

      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async newAuthor(id: number) {
    try {
      if (!id) {
        throw new BadRequestException('user not found.');
      }

      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException('user not found.');
      }

      for (const column in user) {
        if (!user[column]) {
          throw new ForbiddenException(`this user ${column} is incomplete.`);
        }
      }

      user.roles = [UserRoles.author];
      await this.userRepo.save(user);
      delete user.password;

      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(updateUserDto: UpdateUserDto, req: any) {
    try {
      return `This action updates a  user`;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      if (!id) {
        throw new BadRequestException('user not found.');
      }

      const result = await this.userRepo.delete(id);
      if (!result.affected) {
        throw new BadRequestException('user not found.');
      }

      return 'user removed.';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async ban(id: number) {
    try {
      if (!id) {
        throw new BadRequestException('user not found.');
      }

      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException('user not found.');
      }

      user.isBanned = true;
      await this.userRepo.save(user);

      return 'user is now banned.';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
