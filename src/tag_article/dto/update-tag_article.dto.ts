import { PartialType } from '@nestjs/mapped-types';
import { CreateTagArticleDto } from './create-tag_article.dto';

export class UpdateTagArticleDto extends PartialType(CreateTagArticleDto) {}
