import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { randomUUID } from 'crypto';

export class ProductLinkDto {
  @ApiProperty({ example: randomUUID() })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

class OrderLinkDto {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class CreateOrderItemDto {
  @ApiProperty()
  @IsNotEmpty()
  product: ProductLinkDto;

  @ApiProperty({
    example: {
      id: randomUUID(),
    },
  })
  order: OrderLinkDto;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.0001)
  quantity: number;
}
