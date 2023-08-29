import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
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
  async findAll(): Promise<ProductEntity[]> {
    return await this.productService.findAll();
  }
}
