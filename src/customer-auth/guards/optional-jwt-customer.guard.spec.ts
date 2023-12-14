import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes, randomUUID } from 'crypto';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { JwtStrategy } from '../strategies/jwt-customer.strategy';
import { CustomerService } from 'src/customer/customer.service';
import { CustomerEntity } from 'src/customer/entities/customer.entity';
import { UnauthorizedException } from '@nestjs/common';
import { OptionalJwtCustomerGuard } from './optional-jwt-customer.guard';

describe('OptionalJwtCustomerGuard', () => {
  let optionalJwtCustomerGuard: OptionalJwtCustomerGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OptionalJwtCustomerGuard],
    }).compile();

    optionalJwtCustomerGuard = module.get<OptionalJwtCustomerGuard>(
      OptionalJwtCustomerGuard,
    );
  });

  it('should be defined', () => {
    expect(optionalJwtCustomerGuard).toBeDefined();
  });

  describe('handleRequest', () => {
    it('should handle a request without returning any error', () => {
      const user = {
        id: randomUUID(),
      };
      const result = optionalJwtCustomerGuard.handleRequest(
        new Error(),
        user,
        null,
        null,
      );

      expect(result).toStrictEqual(user);
    });
  });
});
