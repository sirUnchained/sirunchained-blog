import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @Length(5, 1000)
  @IsString()
  @IsNotEmpty()
  content: string;
}
