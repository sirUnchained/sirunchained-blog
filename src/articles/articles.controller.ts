import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFile() file: any,
    @Req() req: any,
  ) {
    return this.articlesService.create(createArticleDto, file, req);
  }

  @Get()
  findAll(@Query() queries: { limit: number; page: number; category: number }) {
    return this.articlesService.findAll(queries);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('cover'))
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @UploadedFile() file: any,
    @Req() req: any,
  ) {
    return this.articlesService.update(+id, updateArticleDto, file, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
