import { ApiProperty } from '@nestjs/swagger';
import { CreateCartItemDto } from './create-cart-item.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class NewCartItemDto extends CreateCartItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  unitValue: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  total: number;
}
