import { IsNotEmpty, IsOptional, Length } from 'class-validator';

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
  tags: string;

  @IsNotEmpty()
  category: number;
}
