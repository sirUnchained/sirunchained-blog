import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateCommentDto {
  @Length(5, 1000)
  @IsString()
  @IsNotEmpty()
  content: string;

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  article: number;
}
