import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes, randomUUID } from 'crypto';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;

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
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a payload successfully', async () => {
      const payloadMock: JwtPayloadDto = {
        sub: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
      };

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
    });
  });
});
