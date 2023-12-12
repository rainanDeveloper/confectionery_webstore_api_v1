import { OmitType } from '@nestjs/swagger';
import {
  CartItemLinksDto,
  CreateCartServiceDto,
} from './create-cart-service.dto';
import { ArrayNotEmpty } from 'class-validator';

export class CreateCartControllerDto extends OmitType(CreateCartServiceDto, [
  'customer',
]) {
  @ArrayNotEmpty()
  itens: CartItemLinksDto[];
}
