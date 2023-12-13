import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { randomUUID } from 'crypto';

export class ProductLinkDto {
  @ApiProperty({ example: randomUUID() })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class CartLinkDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class CreateCartItemDto {
  @ApiProperty()
  @IsNotEmpty()
  product: ProductLinkDto;

  @ApiProperty()
  @IsNotEmpty()
  cart: CartLinkDto;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.0001)
  quantity: number;
}
