import { Injectable } from '@nestjs/common';
import { CreateTagArticleDto } from './dto/create-tag_article.dto';
import { UpdateTagArticleDto } from './dto/update-tag_article.dto';

@Injectable()
export class TagArticleService {
  create(createTagArticleDto: CreateTagArticleDto) {
    return 'This action adds a new tagArticle';
  }

  findAll() {
    return `This action returns all tagArticle`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tagArticle`;
  }

  update(id: number, updateTagArticleDto: UpdateTagArticleDto) {
    return `This action updates a #${id} tagArticle`;
  }

  remove(id: number) {
    return `This action removes a #${id} tagArticle`;
  }
}
