import { IsBoolean, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @MinLength(8, {
    message: 'Password cannot be less than 8 characters',
  })
  @IsString()
  password: string;

  @IsBoolean()
  isAdmin = false;
}
