import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTagDto {
  @Length(1, 50)
  @IsString()
  @IsNotEmpty()
  name: string;
}
