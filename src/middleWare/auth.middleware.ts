import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';

import bcrypt from 'bcrypt';
import { TokenEntity } from 'src/auth/entities/token.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class authMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepo: Repository<TokenEntity>,
  ) {}

  async use(req: any, res: any, next: NextFunction) {
    try {
      const hashedToken = req.headers.authorization?.split(' ')[1];
      if (!hashedToken) {
        throw new BadRequestException('please sign in or sign up first.');
      }

      const realTokenData = await this.tokenRepo.findOne({
        where: { token: hashedToken },
        relations: ['users'],
      });
      if (!realTokenData) {
        throw new BadRequestException(
          'token is not valid, please sign in or sign up first.',
        );
      }

      req.body.user = realTokenData.user;
      next();
      return;
    } catch (error) {
      throw error;
    }
  }
}
