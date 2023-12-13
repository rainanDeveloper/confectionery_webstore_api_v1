import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  CartItemLinksDto,
  CreateCartServiceDto,
} from './create-cart-service.dto';
import { ArrayNotEmpty, IsArray, isArray } from 'class-validator';

export class CreateCartControllerDto extends OmitType(CreateCartServiceDto, [
  'customer',
]) {
  @ArrayNotEmpty()
  itens: CartItemLinksDto[];
}
