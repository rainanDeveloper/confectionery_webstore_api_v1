import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CustomerConfirmationDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
