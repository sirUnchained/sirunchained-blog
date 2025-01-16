import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
  Min,
} from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @Length(8, 100)
  title: string;

  @IsNotEmpty()
  @Length(8, 250)
  description: string;

  @IsOptional()
  cover: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  isPublished: string;

  @IsNotEmpty()
  category: number;
}
