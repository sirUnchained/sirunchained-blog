import { Optional } from '@nestjs/common';
import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @Optional()
  @IsBoolean()
  remember: Boolean;
}
