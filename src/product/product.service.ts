import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
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

  async create(createProductDto: CreateProductDto): Promise<string> {
    const product = this.productRepository.create(createProductDto);

    await this.productRepository.save(product);

    return product.id;
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

  async findOne(id: string): Promise<ProductEntity> {
    return this.productRepository.findOne({
      where: {
        id,
      },
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
    const existent = await this.productRepository.findOneBy({
      id: productId,
    });

    if (!existent) {
      throw new NotFoundException(`Product ${productId} not found!`);
    }

    existent.title = productDto.title;
    existent.description = productDto.description;
    existent.cost = productDto.cost;
    existent.profitPercent = productDto.profitPercent;
    existent.unitValue = productDto.unitValue;
    existent.categories = productDto.categories as any;

    await this.productRepository.save(existent);

    return;
  }

  async delete(productId: string) {
    return await this.productRepository.delete({
      id: productId,
    });
  }
}
