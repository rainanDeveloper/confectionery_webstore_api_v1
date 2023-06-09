import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes, randomUUID } from 'crypto';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Request } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should login the user successfully', async () => {
      const user: UserEntity = {
        id: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
      } as UserEntity;

      const request: Request = {
        user,
      } as any;

      const mockLoginResult = {
        token: randomBytes(32).toString('hex'),
      };

      jest.spyOn(authService, 'login').mockResolvedValueOnce(mockLoginResult);

      const result = await authController.login(request);

      expect(result).toBeDefined();
      expect(result).toEqual(mockLoginResult);
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(authService.login).toHaveBeenCalledWith(request.user);
    });
  });
});
