import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn(),
            merge: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneOrFail: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        login: 'SomeTestLogin',
        email: 'some.test@email.example',
        password: 'S0m3T3stP4ssw0rd',
      };

      const userMock = {
        id: randomUUID(),
        ...createUserDto,
        isActive: true,
        firstAccess: true,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      } as any;

      jest.spyOn(userRepository, 'create').mockReturnValueOnce(userMock);

      const result = await userService.create(createUserDto);

      expect(result).not.toBeNull();
      expect(result).toBeDefined();
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(userMock);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw a BadRequestException if the save method throws an error', () => {
      const createUserDto: CreateUserDto = {
        login: 'SomeTestLogin',
        email: 'some.test@email.example',
        password: 'S0m3T3stP4ssw0rd',
      };

      const userMock = {
        id: randomUUID(),
        ...createUserDto,
        isActive: true,
        firstAccess: true,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      } as any;

      jest.spyOn(userRepository, 'create').mockReturnValueOnce(userMock);
      jest.spyOn(userRepository, 'save').mockRejectedValueOnce(new Error());

      const resultPromise = userService.create(createUserDto);

      expect(resultPromise).rejects.toThrow(BadRequestException);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(userMock);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });
  });
  describe('findAll', () => {
    it('should find all users successfully', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue([]);

      const result = await userService.findAll();

      expect(result).not.toBeNull();
      expect(result).toBeDefined();
      expect(userRepository.find).toHaveBeenCalledWith({
        select: ['id', 'login', 'email', 'isActive', 'createdAt', 'updatedAt'],
      });
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });
  });
  describe('findOneByEmailOrLogin', () => {
    it('should find a user successfully', async () => {
      const email = 'email@test.example';

      const userMock = {
        id: randomUUID(),
        login: 'SomeTestLogin',
        email,
        password: 'S0m3T3stP4ssw0rd',
        isActive: true,
        firstAccess: true,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      } as any;

      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockResolvedValueOnce(userMock);

      const result = await userService.findOneByEmailOrLogin(email);

      expect(result).not.toBeNull();
      expect(result).toBeDefined();
      expect(userRepository.findOneOrFail).toHaveBeenCalledWith({
        where: [
          {
            email,
          },
          {
            login: email,
          },
        ],
      });
      expect(userRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('should throw an NotFoundException when the method findOneOrFail fails', () => {
      const email = 'email@test.example';

      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      const resultPromise = userService.findOneByEmailOrLogin(email);

      expect(resultPromise).rejects.toThrow(NotFoundException);
    });
  });
  describe('findOneById', () => {
    it('should find a user successfully', async () => {
      const id = randomUUID();

      const userMock = {
        id,
        login: 'SomeTestLogin',
        email: 'some.test@email.example',
        password: 'S0m3T3stP4ssw0rd',
        isActive: true,
        firstAccess: true,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      } as any;

      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockResolvedValueOnce(userMock);

      const result = await userService.findOneById(id);

      expect(result).not.toBeNull();
      expect(result).toBeDefined();
      expect(userRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id },
        select: ['id', 'email', 'login', 'isActive', 'createdAt', 'updatedAt'],
      });
      expect(userRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('should throw an NotFoundException when the method findOneOrFail fails', () => {
      const id = randomUUID();

      jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      const resultPromise = userService.findOneById(id);

      expect(resultPromise).rejects.toThrow(NotFoundException);
      expect(userRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id },
        select: ['id', 'email', 'login', 'isActive', 'createdAt', 'updatedAt'],
      });
      expect(userRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });
  });
  describe('updateOne', () => {
    it('should update a user successfully', async () => {
      const id = randomUUID();

      const updateUserDto: UpdateUserDto = {
        login: 'newLogin',
      };

      const userMock = {
        id,
        login: 'SomeTestLogin',
        email: 'some.test@email.example',
        password: 'S0m3T3stP4ssw0rd',
        isActive: true,
        firstAccess: true,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      } as any;

      jest.spyOn(userService, 'findOneById').mockResolvedValueOnce(userMock);

      await userService.updateOne(id, updateUserDto);

      expect(userService.findOneById).toHaveBeenCalledWith(id);
      expect(userService.findOneById).toHaveBeenCalledTimes(1);
      expect(userRepository.merge).toHaveBeenCalledWith(
        userMock,
        updateUserDto,
      );
      expect(userRepository.save).toHaveBeenCalledWith(userMock);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });
  });
  describe('deleteOne', () => {
    it('should delete a user successfully', async () => {
      const id = randomUUID();

      const userMock = {
        id,
        login: 'SomeTestLogin',
        email: 'some.test@email.example',
        password: 'S0m3T3stP4ssw0rd',
        isActive: true,
        firstAccess: true,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      } as any;

      jest.spyOn(userService, 'findOneById').mockResolvedValueOnce(userMock);

      await userService.deleteOne(id);

      expect(userService.findOneById).toHaveBeenCalledWith(id);
      expect(userService.findOneById).toHaveBeenCalledTimes(1);
      expect(userRepository.delete).toHaveBeenCalledWith({ id });
    });
  });
});
