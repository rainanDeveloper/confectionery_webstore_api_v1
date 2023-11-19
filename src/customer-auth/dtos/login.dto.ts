import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'john_doe' })
  login: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'uHhauwOE0o' })
  password: string;
}
