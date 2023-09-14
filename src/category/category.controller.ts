import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(
    @Inject(CategoryService) private readonly categoryService: CategoryService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<null | undefined> {
    return await this.categoryService.create(createCategoryDto);
  }
}
