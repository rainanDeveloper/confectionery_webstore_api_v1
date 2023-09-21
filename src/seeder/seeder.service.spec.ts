import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';
import { SeederService } from './seeder.service';

describe('SeederService', () => {
  let seederService: SeederService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    seederService = module.get<SeederService>(SeederService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(seederService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('onApplicationBootstrap', () => {
    it('should seed the database', async () => {
      jest.spyOn(userService, 'findAll').mockResolvedValueOnce([]);
      await seederService.onApplicationBootstrap();

      expect(userService.findAll).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledTimes(1);
    });

    it('should not seed the user table because has a user', async () => {
      const userMock = {
        id: randomUUID(),
        login: 'SomeTestLogin',
        email: 'some.test@email.example',
        password: 'S0m3T3stP4ssw0rd',
        isActive: true,
        firstAccess: true,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      } as any;

      jest.spyOn(userService, 'findAll').mockResolvedValueOnce([userMock]);
      await seederService.onApplicationBootstrap();

      expect(userService.findAll).toHaveBeenCalledTimes(1);
      expect(userService.create).not.toHaveBeenCalled();
    });
  });
});
