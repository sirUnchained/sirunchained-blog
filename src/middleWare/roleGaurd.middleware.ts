import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import UserRoles from 'src/Enums/usersEnum/roles.enum';

@Injectable()
export class RoleGuard implements NestMiddleware {
  use(roles: UserRoles[]) {
    return function (req: any, res: any, next: NextFunction) {
      try {
        const user = req.user;
        roles.forEach((role) => {
          if (!user.roles.includes(role)) {
            throw new ForbiddenException(
              "this route is protected and you don't have the required role.",
            );
          }
        });
        next();
        return;
      } catch (error) {
        if (error instanceof ForbiddenException) {
          throw error;
        }
        throw new InternalServerErrorException(error.message);
      }
    };
  }
}
