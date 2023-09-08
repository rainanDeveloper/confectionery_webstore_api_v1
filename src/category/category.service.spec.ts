import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
  });

  it('should be defined', () => {
    expect(categoryService).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      const categoryDto: CreateCategoryDto = {
        title: 'some category title',
      };

      const categoryMock = new CategoryEntity();

      categoryMock.title = categoryDto.title;

      jest
        .spyOn(categoryRepository, 'create')
        .mockReturnValueOnce(categoryMock);

      const result = await categoryService.create(categoryDto);

      expect(result).not.toBeDefined();
      expect(categoryRepository.create).toHaveBeenCalledTimes(1);
      expect(categoryRepository.create).toHaveBeenCalledWith(categoryDto);
      expect(categoryRepository.save).toHaveBeenCalledTimes(1);
      expect(categoryRepository.save).toHaveBeenCalledWith(categoryMock);
    });

    it('should create a category with description successfully', async () => {
      const categoryDto: CreateCategoryDto = {
        title: 'some category title',
        description: 'some description on a category',
      };

      const categoryMock = new CategoryEntity();

      categoryMock.title = categoryDto.title;
      categoryMock.description = categoryDto.description;

      jest
        .spyOn(categoryRepository, 'create')
        .mockReturnValueOnce(categoryMock);

      const result = await categoryService.create(categoryDto);

      expect(result).not.toBeDefined();
      expect(categoryRepository.create).toHaveBeenCalledTimes(1);
      expect(categoryRepository.create).toHaveBeenCalledWith(categoryDto);
      expect(categoryRepository.save).toHaveBeenCalledTimes(1);
      expect(categoryRepository.save).toHaveBeenCalledWith(categoryMock);
    });
  });

  describe('findAll', () => {
    it('should find a list of categories', async () => {
      const categoriesMock = [new CategoryEntity()];

      jest
        .spyOn(categoryRepository, 'find')
        .mockResolvedValueOnce(categoriesMock);

      const result = await categoryService.findAll();

      expect(result).toEqual(categoriesMock);
      expect(categoryRepository.find).toHaveBeenCalledTimes(1);
      expect(categoryRepository.find).toHaveBeenCalledWith();
    });
  });

  describe('updateOne', () => {
    it('should update a product successfully', async () => {
      const categoryId = randomUUID();
      const categoryDto: UpdateCategoryDto = {
        title: 'some new title',
      };

      const result = await categoryService.updateOne(categoryId, categoryDto);

      expect(result).not.toBeDefined();
      expect(categoryRepository.update).toHaveBeenCalledTimes(1);
      expect(categoryRepository.update).toHaveBeenCalledWith(
        {
          id: categoryId,
        },
        categoryDto,
      );
    });
  });
});
