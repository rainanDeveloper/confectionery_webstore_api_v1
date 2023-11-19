import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { CustomerAuthService } from './customer-auth.service';
import { Request } from 'express';
import { CustomerEntity } from 'src/customer/entities/customer.entity';
import { LoginDto } from './dtos/login.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthCustomerStrategy } from './strategies/auth-customer.strategy';

@ApiTags('Customer Auth')
@Controller('customer-auth')
export class CustomerAuthController {
  constructor(
    @Inject(CustomerAuthService)
    private readonly customerAuthService: CustomerAuthService,
  ) {}

  @UseGuards(AuthGuard('customer'))
  @Post('login')
  @ApiBody({
    type: LoginDto,
  })
  async login(@Req() request: Request) {
    return this.customerAuthService.login(request.user as CustomerEntity);
  }
}
