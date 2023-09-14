import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryEntity } from './entities/category.entity';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    categoryController = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(categoryController).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  describe('create', () => {
    it('should create a category sucessfully', async () => {
      const categoryDto: CreateCategoryDto = {
        title: 'some category title',
      };

      const result = await categoryController.create(categoryDto);

      expect(result).not.toBeDefined();
      expect(categoryService.create).toHaveBeenCalledTimes(1);
      expect(categoryService.create).toHaveBeenCalledWith(categoryDto);
    });
  });

  describe('findAll', () => {
    it('should find all categories sucessfully', async () => {
      const categoriesMock = [new CategoryEntity()];

      jest
        .spyOn(categoryService, 'findAll')
        .mockResolvedValueOnce(categoriesMock);

      const result = await categoryService.findAll();

      expect(result).toStrictEqual(categoriesMock);
      expect(categoryService.findAll).toHaveBeenCalledTimes(1);
      expect(categoryService.findAll).toHaveBeenCalledWith();
    });
  });
});
