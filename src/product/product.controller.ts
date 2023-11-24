import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dtos/create-product.dto';
import { SearchProductDto } from './dtos/search-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';
import { Response } from 'express';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(
    @Inject(ProductService) private readonly productService: ProductService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async create(
    @Res() response: Response,
    @Body() productDto: CreateProductDto,
  ): Promise<undefined> {
    const productId = await this.productService.create(productDto);

    const getUrl = `product/${productId}`;

    response.header('location', getUrl).status(HttpStatus.CREATED);

    return;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() productDto: UpdateProductDto) {
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
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    return await this.productService.delete(id);
  }
}
