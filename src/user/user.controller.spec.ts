import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        login: 'some_login',
        email: 'some@test.email',
        password: 'S0m3T3stP4ss',
      };

      const mockUserId = randomUUID();

      const sendMock = jest.fn().mockReturnValue(undefined);
      const statusMock = jest.fn().mockImplementation((_status: number) => {
        return {
          send: sendMock,
        };
      });
      const headerMock = jest.fn().mockReturnValue({ status: statusMock });

      const responseMock = {
        header: headerMock,
      } as any;

      jest.spyOn(userService, 'create').mockResolvedValueOnce(mockUserId);

      const created = await userController.create(responseMock, createUserDto);

      expect(created).toBeUndefined();
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(headerMock).toHaveBeenCalledTimes(1);
      expect(headerMock).toHaveBeenCalledWith('location', `user/${mockUserId}`);
      expect(statusMock).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith();
    });
  });

  describe('findAll', () => {
    it('should find all users successfully', async () => {
      const userListMock: UserEntity[] = [
        {
          id: randomUUID(),
          login: 'some_login',
          email: 'some@test.email',
          password: 'S0m3T3stP4ss',
        } as UserEntity,
      ];

      jest.spyOn(userService, 'findAll').mockResolvedValueOnce(userListMock);

      const finded = await userController.findAll();

      expect(finded).toBeDefined();
      expect(finded).toEqual(userListMock);
      expect(userService.findAll).toHaveBeenCalledTimes(1);
      expect(userService.findAll).toHaveBeenCalledWith();
    });
  });

  describe('find', () => {
    it('should find a user successfully', async () => {
      const mockUser = {
        id: randomUUID(),
        login: 'some_login',
        email: 'some@test.email',
        password: 'S0m3T3stP4ss',
      } as UserEntity;

      jest.spyOn(userService, 'findOneById').mockResolvedValueOnce(mockUser);

      const finded = await userController.find(mockUser.id);

      expect(finded).toBeDefined();
      expect(finded).toEqual(mockUser);
      expect(userService.findOneById).toHaveBeenCalledTimes(1);
      expect(userService.findOneById).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('updateOne', () => {
    it('should update a user sucessfully', async () => {
      const updateUserDto: UpdateUserDto = {
        login: 'some_new_login',
      };

      const userMock = {
        id: randomUUID(),
        ...updateUserDto,
        email: 'some@test.email',
        password: 'S0m3T3stP4ss',
      } as UserEntity;

      const result = await userController.updateOne(userMock.id, updateUserDto);

      expect(result).toBeUndefined();
      expect(userService.updateOne).toHaveBeenCalledTimes(1);
      expect(userService.updateOne).toHaveBeenCalledWith(
        userMock.id,
        updateUserDto,
      );
    });
  });

  describe('deleteOne', () => {
    it('should delete a user successfully', async () => {
      const userMock = {
        id: randomUUID(),
        login: 'some_login',
        email: 'some@test.email',
        password: 'S0m3T3stP4ss',
      } as UserEntity;

      const result = await userController.deleteOne(userMock.id);

      expect(result).toBeUndefined();
      expect(userService.deleteOne).toHaveBeenCalledTimes(1);
      expect(userService.deleteOne).toHaveBeenCalledWith(userMock.id);
    });
  });
});
