import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'RonSwanson' })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ example: 'ronsw4ns0nisth3b3st' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'ronswanson@fuckthestate.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ron Swanson' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '+559551583801' })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  contactPhone: string;

  @ApiProperty({ example: '+559551583801' })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  whatsapp?: string;
}
