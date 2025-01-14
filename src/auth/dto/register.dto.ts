import { Optional } from '@nestjs/common';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/((0?9)|(\+?989))\d{2}\W?\d{3}\W?\d{4}/g, {
    message: 'phone number is not valid.',
  })
  phone: string;

  @Optional()
  @IsEmail()
  @IsString()
  email: string;

  @Optional()
  @IsBoolean()
  remember: Boolean;
}