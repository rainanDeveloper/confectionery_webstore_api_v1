import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { CustomerService } from 'src/customer/customer.service';
import { CustomerEntity } from 'src/customer/entities/customer.entity';
import { JwtPayloadDto } from './dtos/jwt-payload.dto';

@Injectable()
export class CustomerAuthService {
  constructor(
    @Inject(CustomerService) private readonly customerService: CustomerService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async login(customer: CustomerEntity) {
    const payload: JwtPayloadDto = {
      sub: customer.id,
      login: customer.login,
      email: customer.email,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

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
