import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<null | undefined> {
    const product = await this.categoryRepo.create(createCategoryDto);

    await this.categoryRepo.save(product);
    return;
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepo.find();
  }

  async update(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<null | undefined> {
    await this.categoryRepo.update(
      {
        id: categoryId,
      },
      updateCategoryDto,
    );
    return;
  }

  async delete(categoryId: string): Promise<null | undefined> {
    await this.categoryRepo.delete({
      id: categoryId,
    });
    return;
  }
}
