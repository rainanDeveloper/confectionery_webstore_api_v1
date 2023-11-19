import { OmitType } from '@nestjs/swagger';
import { CreateCustomerAddressDto } from './create-customer-address.dto';

export class CreateCustomerAddressControllerDto extends OmitType(
  CreateCustomerAddressDto,
  ['customer'],
) {}
