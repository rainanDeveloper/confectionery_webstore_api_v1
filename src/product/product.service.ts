import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { SearchProductDto } from './dtos/search-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {
  private paginationAmount: number;
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    this.paginationAmount =
      parseInt(this.configService.get('PAGINATION_AMOUNT')) || 100;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const product = this.productRepository.create(createProductDto);

    await this.productRepository.save(product);

    return product;
  }

  async findAll(page = 1): Promise<ProductEntity[]> {
    const skip = (page - 1) * this.paginationAmount;
    const take = this.paginationAmount;

    return await this.productRepository.find({
      select: ['id', 'title', 'description', 'categories', 'unitValue'],
      relations: ['categories'],
      skip,
      take,
    });
  }

  async search(searchDto: SearchProductDto): Promise<ProductEntity[]> {
    const skip = (searchDto.page - 1) * this.paginationAmount;
    const take = this.paginationAmount;

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
      select: ['id', 'title', 'description', 'unitValue'],
      skip,
      take,
    });
  }

  async update(productId: string, productDto: UpdateProductDto) {
    return await this.productRepository.update(
      {
        id: productId,
      },
      productDto,
    );
  }

  async delete(productId: string) {
    return await this.productRepository.delete({
      id: productId,
    });
  }
}
