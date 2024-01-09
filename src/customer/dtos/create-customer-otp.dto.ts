import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCustomerOtpDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  otp: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
