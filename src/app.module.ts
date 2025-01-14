import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import UserRoles from 'src/Enums/usersEnum/roles.enum';
import { RoleGuard } from 'src/middleWare/roleGaurd.middleware';
import { AuthMiddleware } from 'src/middleWare/auth.middleware';
import { TokenEntity } from 'src/auth/entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TokenEntity]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      password: '11111111',
      host: 'localhost',
      port: 5432,
      database: 'sirunchained-blog',
      entities: [UserEntity, TokenEntity],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'users*', method: RequestMethod.ALL });

    consumer
      .apply(new RoleGuard().use([UserRoles.admin, UserRoles.author]))
      .exclude(
        { path: 'users/:id', method: RequestMethod.PUT },
        { path: 'users/me', method: RequestMethod.GET },
      )
      .forRoutes({ path: 'users*', method: RequestMethod.ALL });
  }
}
