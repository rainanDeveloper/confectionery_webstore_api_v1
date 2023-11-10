import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { randomUUID } from 'crypto';

export class LinkCustomerDto {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class CreateCustomerAddressDto {
  @ApiProperty({
    example: {
      id: randomUUID(),
    },
  })
  customer: LinkCustomerDto;

  @ApiProperty({
    example: '60347120',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  zipCode: string;

  @ApiProperty({
    example: 'Vila Geovani',
  })
  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  @ApiProperty({
    example: 'Vila Velha',
  })
  @IsString()
  addressLine2?: string;

  @ApiProperty({
    example: 'Fortaleza',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    example: 'CE',
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    example: 'Brasil',
  })
  @IsNotEmpty()
  @IsString()
  country: string;
}
