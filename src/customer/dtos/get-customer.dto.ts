import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';
import { CreateCustomerDto } from './create-customer.dto';

export class GetCustomerDto extends OmitType(CreateCustomerDto, ['password']) {
  @ApiProperty({ example: randomUUID() })
  @IsString()
  @IsUUID()
  id: string;
}
