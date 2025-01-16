import {
  IsBoolean,
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @IsLowercase()
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

  @IsOptional()
  @IsEmail()
  @IsString()
  email: string;

  @IsOptional()
  @IsBoolean()
  remember: Boolean;
}
