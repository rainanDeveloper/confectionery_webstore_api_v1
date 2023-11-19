import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CustomerAuthService } from '../customer-auth.service';

@Injectable()
export class AuthCustomerStrategy extends PassportStrategy(
  Strategy,
  'customer',
) {
  constructor(
    @Inject(CustomerAuthService)
    private readonly customerAuthService: CustomerAuthService,
  ) {
    super({
      usernameField: 'login',
    });
  }

  async validate(login: string, password: string) {
    const customer = await this.customerAuthService.validateCustomer(
      login,
      password,
    );

    if (!customer)
      throw new UnauthorizedException('Login/Email and/or password is isvalid');

    return customer;
  }
}
