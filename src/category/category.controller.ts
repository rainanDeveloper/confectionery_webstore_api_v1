import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(
    @Inject(CategoryService) private readonly categoryService: CategoryService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt-user'))
  @ApiBearerAuth()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<null | undefined> {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt-user'))
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() categoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(id, categoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt-user'))
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    return await this.categoryService.delete(id);
  }
}
