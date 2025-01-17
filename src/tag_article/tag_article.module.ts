import { Module } from '@nestjs/common';
import { TagArticleService } from './tag_article.service';
import { TagArticleController } from './tag_article.controller';

@Module({
  controllers: [TagArticleController],
  providers: [TagArticleService],
})
export class TagArticleModule {}
