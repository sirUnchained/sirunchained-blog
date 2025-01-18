import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class UpdateCommentDto {
  @Length(5, 1000)
  @IsString()
  @IsNotEmpty()
  content: string;
}
