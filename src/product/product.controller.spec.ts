import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { UpdateResult } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { SearchProductDto } from './dtos/search-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            search: jest.fn(),
          },
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const productMock = new ProductEntity();

      const productDto: CreateProductDto = {
        title: 'some product',
        description: 'some description',
        cost: 25,
        unitValue: 30,
      };

      jest.spyOn(productService, 'create').mockResolvedValueOnce(productMock);

      const result = await productController.create(productDto);

      expect(result).toStrictEqual(productMock);
      expect(productService.create).toHaveBeenCalledTimes(1);
      expect(productService.create).toHaveBeenCalledWith(productDto);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateResultMock = new UpdateResult();

      const id = randomUUID();

      const productDto: UpdateProductDto = {
        title: 'some new title',
      };

      jest
        .spyOn(productService, 'update')
        .mockResolvedValueOnce(updateResultMock);

      const result = await productController.update(id, productDto);

      expect(result).toStrictEqual(updateResultMock);
      expect(productService.update).toHaveBeenCalledTimes(1);
      expect(productService.update).toHaveBeenCalledWith(id, productDto);
    });
  });

  describe('findAll', () => {
    it('should list all products', async () => {
      const productsMock = [new ProductEntity()];

      jest.spyOn(productService, 'findAll').mockResolvedValueOnce(productsMock);

      const result = await productController.findAll({});

      expect(result).toStrictEqual(productsMock);
      expect(productService.findAll).toHaveBeenCalledTimes(1);
      expect(productService.findAll).toHaveBeenCalledWith();
    });

    it('should search using searchTerm', async () => {
      const searchDto: SearchProductDto = {
        searchTerm: 'some search term',
      };

      const productsMock = [new ProductEntity()];

      jest.spyOn(productService, 'search').mockResolvedValueOnce(productsMock);

      const result = await productController.findAll(searchDto);

      expect(result).toStrictEqual(productsMock);
      expect(productService.search).toHaveBeenCalledTimes(1);
      expect(productService.search).toHaveBeenCalledWith(searchDto);
    });

    it('should find all products on page 2', async () => {
      const searchDto: SearchProductDto = {
        page: 2,
      };

      const productsMock = [new ProductEntity()];

      jest.spyOn(productService, 'findAll').mockResolvedValueOnce(productsMock);

      const result = await productController.findAll(searchDto);

      expect(result).toStrictEqual(productsMock);
      expect(productService.findAll).toHaveBeenCalledTimes(1);
      expect(productService.findAll).toHaveBeenCalledWith(searchDto.page);
    });
  });
});
