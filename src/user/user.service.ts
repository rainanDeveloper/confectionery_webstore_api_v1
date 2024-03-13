import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    const newUser = this.userRepository.create(createUserDto);

    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }

    return newUser.id;
  }
  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find({
      select: ['id', 'login', 'email', 'isActive', 'createdAt', 'updatedAt'],
    });
  }
  async findOneByEmailOrLogin(emailOrLogin: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: [
          {
            email: emailOrLogin,
          },
          {
            login: emailOrLogin,
          },
        ],
      });
    } catch (error) {
      throw new NotFoundException(`Usuário não encontrado`);
    }
  }
  async findOneById(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { id },
        select: ['id', 'email', 'login', 'isActive', 'createdAt', 'updatedAt'],
      });
    } catch (error) {
      throw new NotFoundException(`Usuário não encontrado`);
    }
  }
  async updateOne(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const finded = await this.findOneById(id);

    this.userRepository.merge(finded, updateUserDto);

    await this.userRepository.save(finded);
  }
  async deleteOne(id: string): Promise<void> {
    await this.findOneById(id);

    await this.userRepository.delete({ id });
  }
}
