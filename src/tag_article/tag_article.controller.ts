import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagArticleService } from './tag_article.service';
import { CreateTagArticleDto } from './dto/create-tag_article.dto';
import { UpdateTagArticleDto } from './dto/update-tag_article.dto';

@Controller('tag-article')
export class TagArticleController {
  constructor(private readonly tagArticleService: TagArticleService) {}

  @Post()
  create(@Body() createTagArticleDto: CreateTagArticleDto) {
    return this.tagArticleService.create(createTagArticleDto);
  }

  @Get()
  findAll() {
    return this.tagArticleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagArticleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagArticleDto: UpdateTagArticleDto) {
    return this.tagArticleService.update(+id, updateTagArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagArticleService.remove(+id);
  }
}
