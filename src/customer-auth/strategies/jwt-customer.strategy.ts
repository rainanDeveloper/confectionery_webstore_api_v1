import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-customer') {
  constructor(
    @Inject(ConfigService) configService: ConfigService,
    @Inject(CustomerService)
    private readonly customerService: CustomerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayloadDto) {
    let customer;

    const unauthorizedException =
      "You're not authorized to perform this action!";

    try {
      customer = await this.customerService.findOne(payload.sub);
    } catch (error) {
      new UnauthorizedException();
    }

    if (!customer) throw new UnauthorizedException(unauthorizedException);

    if (customer.email !== payload.email)
      throw new UnauthorizedException(unauthorizedException);

    if (customer.login !== payload.login)
      throw new UnauthorizedException(unauthorizedException);

    return {
      id: payload.sub,
      login: payload.login,
      email: payload.email,
    };
  }
}
