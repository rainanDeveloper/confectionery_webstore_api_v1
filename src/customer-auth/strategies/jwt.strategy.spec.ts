import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes, randomUUID } from 'crypto';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { JwtStrategy } from './jwt.strategy';
import { CustomerService } from 'src/customer/customer.service';
import { CustomerEntity } from 'src/customer/entities/customer.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;
  let customerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest
              .fn()
              .mockReturnValueOnce(randomBytes(32).toString('hex')),
          },
        },
        {
          provide: CustomerService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
    customerService = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
    expect(configService).toBeDefined();
    expect(customerService).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a payload successfully', async () => {
      const payloadMock: JwtPayloadDto = {
        sub: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
      };

      const customerMock: CustomerEntity = {
        id: payloadMock.sub,
        login: payloadMock.login,
        email: payloadMock.email,
      } as any;

      jest
        .spyOn(customerService, 'findOne')
        .mockResolvedValueOnce(customerMock);

      const userMock = {
        id: payloadMock.sub,
        login: payloadMock.login,
        email: payloadMock.email,
      };

      const result = await jwtStrategy.validate(payloadMock);

      expect(result).toBeDefined();
      expect(result).toEqual(userMock);
      expect(configService.getOrThrow).toHaveBeenCalledTimes(1);
      expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
      expect(customerService.findOne).toHaveBeenCalledTimes(1);
      expect(customerService.findOne).toHaveBeenCalledWith(payloadMock.sub);
    });

    it('should throw a unauthorized exception', async () => {
      const payloadMock: JwtPayloadDto = {
        sub: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
      };

      jest.spyOn(customerService, 'findOne').mockResolvedValueOnce(undefined);

      const resultPromise = jwtStrategy.validate(payloadMock);

      expect(resultPromise).rejects.toThrowError(UnauthorizedException);
      expect(configService.getOrThrow).toHaveBeenCalledTimes(1);
      expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
      expect(customerService.findOne).toHaveBeenCalledTimes(1);
      expect(customerService.findOne).toHaveBeenCalledWith(payloadMock.sub);
    });

    it('should throw a unauthorized exception', async () => {
      const payloadMock: JwtPayloadDto = {
        sub: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
      };

      const customerMock: CustomerEntity = {
        id: payloadMock.sub,
        login: 'another_login',
        email: payloadMock.email,
      } as any;

      jest
        .spyOn(customerService, 'findOne')
        .mockResolvedValueOnce(customerMock);

      jest
        .spyOn(customerService, 'findOne')
        .mockResolvedValueOnce(customerMock);

      const resultPromise = jwtStrategy.validate(payloadMock);

      expect(resultPromise).rejects.toThrowError(UnauthorizedException);
      expect(configService.getOrThrow).toHaveBeenCalledTimes(1);
      expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
      expect(customerService.findOne).toHaveBeenCalledTimes(1);
      expect(customerService.findOne).toHaveBeenCalledWith(payloadMock.sub);
    });

    it('should throw a unauthorized exception', async () => {
      const payloadMock: JwtPayloadDto = {
        sub: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
      };

      const customerMock: CustomerEntity = {
        id: payloadMock.sub,
        login: payloadMock.login,
        email: 'some_another@login.mail',
      } as any;

      jest
        .spyOn(customerService, 'findOne')
        .mockResolvedValueOnce(customerMock);

      jest
        .spyOn(customerService, 'findOne')
        .mockResolvedValueOnce(customerMock);

      const resultPromise = jwtStrategy.validate(payloadMock);

      expect(resultPromise).rejects.toThrowError(UnauthorizedException);
      expect(configService.getOrThrow).toHaveBeenCalledTimes(1);
      expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
      expect(customerService.findOne).toHaveBeenCalledTimes(1);
      expect(customerService.findOne).toHaveBeenCalledWith(payloadMock.sub);
    });
  });
});
