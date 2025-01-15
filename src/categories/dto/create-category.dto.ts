import { IsNotEmpty, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @Length(5, 50)
  title: string;
}
