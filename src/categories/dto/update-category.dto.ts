import { IsNotEmpty, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @Length(5, 50)
  title: string;
}
