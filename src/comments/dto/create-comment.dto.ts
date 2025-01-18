import { Optional } from '@nestjs/common';
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

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Optional()
  parent: number | null;
}
