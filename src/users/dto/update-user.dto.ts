import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @Length(5, 100)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/((0?9)|(\+?989))\d{2}\W?\d{3}\W?\d{4}/g, {
    message: 'phone number is not valid.',
  })
  phone: string;
}
