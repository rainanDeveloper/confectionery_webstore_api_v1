import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async create(categoryDto: CreateCategoryDto): Promise<null | undefined> {
    const product = await this.categoryRepo.create(categoryDto);

    await this.categoryRepo.save(product);
    return;
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepo.find();
  }
}
