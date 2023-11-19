import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class CustomerAuthService {
  constructor(
    @Inject(CustomerService) private readonly customerService: CustomerService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async validateCustomer(login: string, password) {
    let customer;

    try {
      customer = await this.customerService.findOneByLoginOrEmail(login);
    } catch (error) {
      return null;
    }

    if (!customer) return null;

    const passwordIsValid = compareSync(password, customer.password);

    if (!passwordIsValid) return null;

    return customer;
  }
}
