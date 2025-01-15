import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import UserRoles from 'src/Enums/usersEnum/roles.enum';
import { RoleGuard } from 'src/middleWare/roleGaurd.middleware';
import { AuthMiddleware } from 'src/middleWare/auth.middleware';
import { TokenEntity } from 'src/auth/entities/token.entity';
import { CategoriesModule } from './categories/categories.module';
import { CategoryEntity } from './categories/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TokenEntity, CategoryEntity]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      password: '11111111',
      host: 'localhost',
      port: 5432,
      database: 'sirunchained-blog',
      entities: [UserEntity, TokenEntity, CategoryEntity],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'categories/', method: RequestMethod.GET })
      .forRoutes(
        { path: 'users*', method: RequestMethod.ALL },
        { path: 'categories*', method: RequestMethod.ALL },
      );

    consumer
      .apply(new RoleGuard().use([UserRoles.admin]))
      .exclude(
        { path: 'users/:id', method: RequestMethod.PUT },
        { path: 'users/me', method: RequestMethod.GET },
        { path: 'categories/', method: RequestMethod.GET },
      )
      .forRoutes(
        { path: 'users*', method: RequestMethod.ALL },
        { path: 'categories*', method: RequestMethod.ALL },
      );
  }
}
