import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { LinkCategoryDto } from './create-product.dto';

export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  cost?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  profitPercent?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  unitValue?: number;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  categories?: LinkCategoryDto[];
}
