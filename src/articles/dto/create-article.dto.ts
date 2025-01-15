import { IsNotEmpty, IsNumber, Length, Min } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @Length(8, 100)
  title: string;

  @IsNotEmpty()
  @Length(8, 250)
  description: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  category: number;
}
