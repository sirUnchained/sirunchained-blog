import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateTagDto {
  @Length(1, 50)
  @IsString()
  @IsNotEmpty()
  name: string;
}
