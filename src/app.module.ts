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
import { ArticlesModule } from './articles/articles.module';
import { ArticleEntity } from './articles/entities/article.entity';
import { ContactsModule } from './contacts/contacts.module';
import { ContactEntity } from './contacts/entities/contact.entity';
import { TagsModule } from './tags/tags.module';
import { TagEntity } from './tags/entities/tag.entity';
import { CommentsModule } from './comments/comments.module';
import { CommentEntity } from './comments/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TokenEntity,
      CategoryEntity,
      ArticleEntity,
      ContactEntity,
      TagEntity,
      CommentEntity,
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      password: '11111111',
      host: 'localhost',
      port: 5432,
      database: 'sirunchained-blog',
      entities: [
        UserEntity,
        TokenEntity,
        CategoryEntity,
        ArticleEntity,
        ContactEntity,
        TagEntity,
        CommentEntity,
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    ArticlesModule,
    ContactsModule,
    TagsModule,
    CommentsModule,
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
        { path: 'articles*', method: RequestMethod.POST },
        { path: 'articles*', method: RequestMethod.PATCH },
        { path: 'articles*', method: RequestMethod.DELETE },
        { path: 'contacts', method: RequestMethod.DELETE },
        { path: 'contacts', method: RequestMethod.GET },
        { path: 'tags*', method: RequestMethod.DELETE },
        { path: 'tags*', method: RequestMethod.PATCH },
        { path: 'tags*', method: RequestMethod.POST },
        { path: 'comments', method: RequestMethod.GET },
        { path: 'comments', method: RequestMethod.POST },
        { path: 'comments*', method: RequestMethod.PATCH },
        { path: 'comments*', method: RequestMethod.PUT },
        { path: 'comments*', method: RequestMethod.DELETE },
      )
      .apply(new RoleGuard().use([UserRoles.admin]))
      .exclude(
        { path: 'users/:id', method: RequestMethod.PUT },
        { path: 'users/me', method: RequestMethod.GET },
        { path: 'categories', method: RequestMethod.GET },
        { path: 'contacts', method: RequestMethod.DELETE },
        { path: 'contacts', method: RequestMethod.GET },
      )
      .forRoutes(
        { path: 'users*', method: RequestMethod.ALL },
        { path: 'categories*', method: RequestMethod.ALL },
        { path: 'articles*', method: RequestMethod.DELETE },
        { path: 'tags*', method: RequestMethod.DELETE },
        { path: 'tags*', method: RequestMethod.PATCH },
        { path: 'comments', method: RequestMethod.GET },
        { path: 'comments*', method: RequestMethod.PATCH },
        { path: 'comments*', method: RequestMethod.DELETE },
      )
      .apply(new RoleGuard().use([UserRoles.author]))
      .exclude(
        { path: 'articles*', method: RequestMethod.GET },
        { path: 'articles*', method: RequestMethod.DELETE },
      )
      .forRoutes(
        { path: 'articles*', method: RequestMethod.PATCH },
        { path: 'articles*', method: RequestMethod.POST },
        { path: 'tags*', method: RequestMethod.POST },
      );
  }
}
