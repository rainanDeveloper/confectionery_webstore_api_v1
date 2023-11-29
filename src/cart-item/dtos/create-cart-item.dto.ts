import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
}
