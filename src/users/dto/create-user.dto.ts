import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(5, 100)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
