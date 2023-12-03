import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class ProductLinkDto {
  @ApiProperty()
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

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0.0001)
  quantity: number;
}
