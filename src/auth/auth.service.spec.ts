import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { hashSync } from 'bcrypt';
import { randomBytes, randomUUID } from 'crypto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtPayloadDto } from './dtos/jwt-payload.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByEmailOrLogin: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      const userMock: UserEntity = {
        id: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
      } as UserEntity;

      const payloadMock: JwtPayloadDto = {
        sub: userMock.id,
        login: userMock.login,
        email: userMock.email,
      };

      const loginResultMock = {
        token: randomBytes(32).toString('hex'),
      };

      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(loginResultMock.token);

      const result = await authService.login(userMock);

      expect(result).toBeDefined();
      expect(result).toEqual(loginResultMock);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(payloadMock);
    });
  });

  describe('validateUser', () => {
    it('should validate a user successfully using login', async () => {
      const passMock = 'G80jTcqRsBzO';

      const userMock: UserEntity = {
        id: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
        password: hashSync(passMock, 8),
      } as UserEntity;

      jest
        .spyOn(userService, 'findOneByEmailOrLogin')
        .mockResolvedValueOnce(userMock);

      const result = await authService.validateUser(userMock.login, passMock);

      expect(result).toBeDefined();
      expect(result).toEqual(userMock);
      expect(userService.findOneByEmailOrLogin).toHaveBeenCalledTimes(1);
      expect(userService.findOneByEmailOrLogin).toHaveBeenCalledWith(
        userMock.login,
      );
    });

    it('should return null when a user is not finded', async () => {
      const passMock = 'G80jTcqRsBzO';

      const userMock: UserEntity = {
        id: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
        password: hashSync(passMock, 8),
      } as UserEntity;

      jest
        .spyOn(userService, 'findOneByEmailOrLogin')
        .mockRejectedValueOnce(new Error());

      const result = await authService.validateUser(userMock.login, passMock);

      expect(result).toBeNull();
      expect(userService.findOneByEmailOrLogin).toHaveBeenCalledTimes(1);
      expect(userService.findOneByEmailOrLogin).toHaveBeenCalledWith(
        userMock.login,
      );
    });

    it('should return null if password is wrong', async () => {
      const passMock = 'G80jTcqRsBzO';

      const userMock: UserEntity = {
        id: randomUUID(),
        login: 'some_login',
        email: 'some@login.mail',
        password: hashSync('some_other_pass', 8),
      } as UserEntity;

      jest
        .spyOn(userService, 'findOneByEmailOrLogin')
        .mockResolvedValueOnce(userMock);

      const result = await authService.validateUser(userMock.login, passMock);

      expect(result).toBeNull();
      expect(userService.findOneByEmailOrLogin).toHaveBeenCalledTimes(1);
      expect(userService.findOneByEmailOrLogin).toHaveBeenCalledWith(
        userMock.login,
      );
    });
  });
});
