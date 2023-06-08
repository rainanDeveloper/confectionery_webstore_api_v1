import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'john_doe' })
  login?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'john.doe@email.com' })
  email?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: '6waKSyOn3R' })
  isActive?: boolean;
}
