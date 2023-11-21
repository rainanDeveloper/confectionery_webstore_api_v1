import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthService } from '../auth.service';
import { LocalStrategy } from './auth-user.strategy';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a user sucessfully', async () => {
      const mockUser: UserEntity = {
        id: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
        password: '3mTOOe9p3t',
      } as UserEntity;

      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(mockUser);

      const result = await localStrategy.validate(
        mockUser.login,
        mockUser.password,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
      expect(authService.validateUser).toHaveBeenCalledWith(
        mockUser.login,
        mockUser.password,
      );
    });
    it('should throw an UnauthorizedException', () => {
      const mockUser: UserEntity = {
        id: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
        password: '3mTOOe9p3t',
      } as UserEntity;

      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(null);

      const resultPromise = localStrategy.validate(
        mockUser.login,
        mockUser.password,
      );

      expect(resultPromise).rejects.toThrow(UnauthorizedException);
    });
  });
});
