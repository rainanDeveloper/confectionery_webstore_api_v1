import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  cost: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  profitPercent?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  unitValue: number;
}
