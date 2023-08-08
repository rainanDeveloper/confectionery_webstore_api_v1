import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { SearchProductDto } from './dtos/search-product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const product = this.productRepository.create(createProductDto);

    await this.productRepository.save(product);

    return product;
  }

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find();
  }

  async search(searchDto: SearchProductDto): Promise<ProductEntity[]> {
    const where:
      | FindOptionsWhere<ProductEntity>
      | FindOptionsWhere<ProductEntity>[] = [
      { title: Like(`%${searchDto.searchTerm}%`) },
      { description: Like(`%${searchDto.searchTerm}%`) },
    ];

    if (searchDto.minUnitValue && searchDto.maxUnitValue) {
      where.push({
        unitValue: Between(searchDto.minUnitValue, searchDto.maxUnitValue),
      });
    }

    return await this.productRepository.find({
      where,
    });
  }
}
