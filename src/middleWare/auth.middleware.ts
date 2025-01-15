import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';

import { TokenEntity } from 'src/auth/entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepo: Repository<TokenEntity>,
  ) {}

  async use(req: any, res: any, next: NextFunction) {
    try {
      const hashedToken = req.headers.authorization?.split(' ')[1];
      if (!hashedToken) {
        throw new UnauthorizedException('please sign in or sign up first.');
      }

      const realTokenData = await this.tokenRepo.findOne({
        where: { token: hashedToken },
        relations: ['user'],
      });
      if (!realTokenData) {
        throw new UnauthorizedException(
          'token is not valid, please sign in or sign up first.',
        );
      }

      delete realTokenData.user.password;

      req.user = realTokenData.user;
      next();
      return;
    } catch (error) {
      throw error;
    }
  }
}
