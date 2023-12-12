import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes, randomUUID } from 'crypto';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { JwtStrategy } from './jwt-user.strategy';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;
  let userService: UserService;

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
          provide: UserService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
    expect(configService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a payload successfully', async () => {
      const payloadMock: JwtPayloadDto = {
        sub: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
      };

      const userEntityMock: UserEntity = {
        id: payloadMock.sub,
        login: payloadMock.login,
        email: payloadMock.email,
      } as any;

      jest
        .spyOn(userService, 'findOneById')
        .mockResolvedValueOnce(userEntityMock);

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
      expect(userService.findOneById).toHaveBeenCalledTimes(1);
      expect(userService.findOneById).toHaveBeenCalledWith(payloadMock.sub);
    });
    it('should throw a unauthorized exception', async () => {
      const payloadMock: JwtPayloadDto = {
        sub: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
      };

      jest.spyOn(userService, 'findOneById').mockResolvedValueOnce(undefined);

      const resultPromise = jwtStrategy.validate(payloadMock);

      expect(resultPromise).rejects.toThrowError(UnauthorizedException);
      expect(configService.getOrThrow).toHaveBeenCalledTimes(1);
      expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
      expect(userService.findOneById).toHaveBeenCalledTimes(1);
      expect(userService.findOneById).toHaveBeenCalledWith(payloadMock.sub);
    });

    it('should throw a unauthorized exception', async () => {
      const payloadMock: JwtPayloadDto = {
        sub: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
      };

      const userEntityMock: UserEntity = {
        id: payloadMock.sub,
        login: 'another_login',
        email: payloadMock.email,
      } as any;

      jest
        .spyOn(userService, 'findOneById')
        .mockResolvedValueOnce(userEntityMock);

      const resultPromise = jwtStrategy.validate(payloadMock);

      expect(resultPromise).rejects.toThrowError(UnauthorizedException);
      expect(configService.getOrThrow).toHaveBeenCalledTimes(1);
      expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
      expect(userService.findOneById).toHaveBeenCalledTimes(1);
      expect(userService.findOneById).toHaveBeenCalledWith(payloadMock.sub);
    });

    it('should throw a unauthorized exception', async () => {
      const payloadMock: JwtPayloadDto = {
        sub: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
      };

      const userEntityMock: UserEntity = {
        id: payloadMock.sub,
        login: payloadMock.login,
        email: 'some_another@login.mail',
      } as any;

      jest
        .spyOn(userService, 'findOneById')
        .mockResolvedValueOnce(userEntityMock);

      const resultPromise = jwtStrategy.validate(payloadMock);

      expect(resultPromise).rejects.toThrowError(UnauthorizedException);
      expect(configService.getOrThrow).toHaveBeenCalledTimes(1);
      expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
      expect(userService.findOneById).toHaveBeenCalledTimes(1);
      expect(userService.findOneById).toHaveBeenCalledWith(payloadMock.sub);
    });
  });
});
