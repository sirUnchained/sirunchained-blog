import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from './entities/token.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import UserRoles from 'src/users/usersEnum/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepo: Repository<TokenEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const remembered = !!registerDto.remember;
      delete registerDto.remember;

      const checkExistedData = await this.userRepo.findOne({
        where: { ...registerDto },
      });
      if (checkExistedData) {
        console.log(checkExistedData);
        throw new BadRequestException(
          'the email or phone or username is not open to use.',
        );
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 12);
      const newUser = this.userRepo.create({
        ...registerDto,
        password: hashedPassword,
      });

      const token = jwt.sign({ id: newUser.id }, 'shhh_tokens_secret_key', {
        expiresIn: remembered ? '7d' : '2d',
        algorithm: 'HS256',
      });
      const hashedToken = await bcrypt.hash(token, 10);

      const expiresAt = remembered
        ? Date.now() + 7 * 24 * 60 * 60 * 1000
        : Date.now() + 2 * 24 * 60 * 60 * 1000;
      await this.tokenRepo.save({
        user: newUser,
        token: hashedToken,
        expiresAt,
      });

      if (newUser.id == 1) {
        newUser.roles = [UserRoles.admin, UserRoles.author];
      }
      await this.userRepo.save(newUser);

      return { token: hashedToken };
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const remembered = !!loginDto.remember;
      delete loginDto.remember;

      const user = await this.userRepo.findOne({
        where: { username: loginDto.username },
      });
      if (!user) {
        throw new BadRequestException('username is not valid.');
      }

      const checkPass = await bcrypt.compare(loginDto.password, user.password);
      if (!checkPass) {
        throw new BadRequestException('datas are not valid.');
      }

      const token = jwt.sign({ id: user.id }, 'shhh_tokens_secret_key', {
        expiresIn: remembered ? '7d' : '2d',
        algorithm: 'HS256',
      });
      const hashedToken = await bcrypt.hash(token, 10);

      const expiresAt = remembered
        ? Date.now() + 7 * 24 * 60 * 60 * 1000
        : Date.now() + 2 * 24 * 60 * 60 * 1000;
      await this.tokenRepo.save({
        user,
        token: hashedToken,
        expiresAt,
      });

      return { token: hashedToken };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
