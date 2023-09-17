import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
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
            update: jest.fn(),
            delete: jest.fn(),
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

  describe('update', () => {
    it('should update a user sucessfully', async () => {
      const categoryId = randomUUID();
      const categoryDto: UpdateCategoryDto = {
        title: 'new title',
      };

      const result = await categoryController.update(categoryId, categoryDto);

      expect(result).not.toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete a category sucessfully', async () => {
      const categoryId = randomUUID();

      const result = await categoryController.delete(categoryId);

      expect(result).not.toBeDefined();
      expect(categoryService.delete).toBeCalledTimes(1);
      expect(categoryService.delete).toBeCalledWith(categoryId);
    });
  });
});
