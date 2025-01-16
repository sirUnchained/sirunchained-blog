import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { ArticleEntity } from './entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, ArticleEntity]),
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, path.join(__dirname, '..', '..', 'public'));
        },
        filename(req, file, callback) {
          const newName = `${Date.now()}-${Math.random() * 10e9}${path.extname(file.originalname)}`;
          callback(null, newName);
        },
      }),
    }),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
