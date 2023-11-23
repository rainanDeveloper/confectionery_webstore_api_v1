import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCustomerAddressDto } from './create-customer-address.dto';

export class UpdateCustomerAddressDto extends OmitType(
  PartialType(CreateCustomerAddressDto),
  ['customer'],
) {}
