import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { SearchProductDto } from './dtos/search-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(
    @Inject(ProductService) private readonly productService: ProductService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() productDto: CreateProductDto): Promise<ProductEntity> {
    return this.productService.create(productDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() productDto: UpdateProductDto,
  ): Promise<UpdateResult> {
    return this.productService.update(id, productDto);
  }

  @Get()
  async findAll(
    @Query() searchDto: SearchProductDto,
  ): Promise<ProductEntity[]> {
    const has_search =
      Object.keys(searchDto).filter((key) => key !== 'page').length > 0;
    const has_page =
      Object.keys(searchDto).filter((key) => key == 'page').length > 0;

    if (has_search) {
      return await this.productService.search(searchDto);
    }
    if (has_page) {
      return await this.productService.findAll(searchDto.page);
    }
    return await this.productService.findAll();
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string) {
    return await this.productService.delete(id);
  }
}
