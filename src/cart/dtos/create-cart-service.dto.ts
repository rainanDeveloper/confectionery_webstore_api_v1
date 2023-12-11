import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateCartItemDto } from 'src/cart-item/dtos/create-cart-item.dto';

export class CustomerLinkDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class CartItemLinksDto extends OmitType(CreateCartItemDto, ['cart']) {}

export class CreateCartServiceDto {
  @ApiProperty()
  @IsOptional()
  customer?: CustomerLinkDto;

  @ApiProperty()
  @IsArray()
  itens: CartItemLinksDto[];
}
