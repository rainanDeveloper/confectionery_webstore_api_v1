import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SearchProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  searchTerm: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  minUnitValue?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  maxUnitValue?: number;
}
