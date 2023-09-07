import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  description?: string;
}
