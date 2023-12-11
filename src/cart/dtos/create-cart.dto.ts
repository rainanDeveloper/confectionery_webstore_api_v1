import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateCartServiceDto } from './create-cart-service.dto';
import { CartStatus } from '../enums/cart-status.enum';
import { IsNotEmpty } from 'class-validator';

export class CreateCartDto extends OmitType(CreateCartServiceDto, ['itens']) {
  @ApiProperty()
  @IsNotEmpty()
  total: number;

  @ApiProperty()
  @IsNotEmpty()
  status: CartStatus;
}
