import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @MinLength(5)
  @IsString()
  subject: string;

  @IsNotEmpty()
  @MinLength(5)
  @IsString()
  title: string;

  @IsNotEmpty()
  @MinLength(5)
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
