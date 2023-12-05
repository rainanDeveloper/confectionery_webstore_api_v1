import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateCartControllerDto } from './create-cart-controller.dto';
import { CartStatus } from '../enums/cart-status.enum';
import { IsNotEmpty } from 'class-validator';

export class CreateCartDto extends OmitType(CreateCartControllerDto, [
  'itens',
]) {
  @ApiProperty()
  @IsNotEmpty()
  total: number;

  @ApiProperty()
  @IsNotEmpty()
  status: CartStatus;
}
