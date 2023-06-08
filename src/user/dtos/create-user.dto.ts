import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'john_doe' })
  login: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'john.doe@email.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({ example: '6waKSyOn3R' })
  password: string;
}
