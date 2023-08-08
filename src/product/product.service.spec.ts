import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Between, Like, Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { SearchProductDto } from './dtos/search-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const productDto: CreateProductDto = {
        title: 'Some product',
        description: 'Some test product',
        cost: 25,
        unitValue: 30,
      };

      const productMock = new ProductEntity();

      productMock.title = productDto.title;
      productMock.description = productDto.description;
      productMock.cost = productDto.cost;
      productMock.unitValue = productDto.unitValue;

      productMock.validateProduct();

      jest.spyOn(productRepository, 'create').mockReturnValueOnce(productMock);

      const newProduct = await productService.create(productDto);

      expect(newProduct).toBeDefined();
      expect(newProduct).toStrictEqual(productMock);
      expect(productRepository.create).toHaveBeenCalledTimes(1);
      expect(productRepository.create).toHaveBeenCalledWith(productDto);
      expect(productRepository.save).toHaveBeenCalledTimes(1);
      expect(productRepository.save).toHaveBeenCalledWith(productMock);
    });
  });

  describe('findAll', () => {
    it('should find a list of products', async () => {
      const productsMock: ProductEntity[] = [new ProductEntity()];

      jest.spyOn(productRepository, 'find').mockResolvedValueOnce(productsMock);

      const products = await productService.findAll();

      expect(products).toStrictEqual(productsMock);
      expect(productRepository.find).toHaveBeenCalledTimes(1);
      expect(productRepository.find).toHaveBeenCalledWith({
        select: ['id', 'title', 'description', 'unitValue'],
      });
    });
  });

  describe('search', () => {
    it('should search using searchterm', async () => {
      const productsMock: ProductEntity[] = [new ProductEntity()];

      jest.spyOn(productRepository, 'find').mockResolvedValueOnce(productsMock);

      const searchDto: SearchProductDto = {
        searchTerm: 'some search term',
      };

      const products = await productService.search(searchDto);

      expect(products).toStrictEqual(productsMock);
      expect(productRepository.find).toHaveBeenCalledTimes(1);
      expect(productRepository.find).toHaveBeenCalledWith({
        where: [
          { title: Like(`%${searchDto.searchTerm}%`) },
          { description: Like(`%${searchDto.searchTerm}%`) },
        ],
        select: ['id', 'title', 'description', 'unitValue'],
      });
    });

    it('should add to search a unit value range', async () => {
      const productsMock: ProductEntity[] = [new ProductEntity()];

      jest.spyOn(productRepository, 'find').mockResolvedValueOnce(productsMock);

      const searchDto: SearchProductDto = {
        searchTerm: 'some search term',
        minUnitValue: 30,
        maxUnitValue: 100,
      };

      const products = await productService.search(searchDto);

      expect(products).toStrictEqual(productsMock);
      expect(productRepository.find).toHaveBeenCalledTimes(1);
      expect(productRepository.find).toHaveBeenCalledWith({
        where: [
          { title: Like(`%${searchDto.searchTerm}%`) },
          { description: Like(`%${searchDto.searchTerm}%`) },
          {
            unitValue: Between(searchDto.minUnitValue, searchDto.maxUnitValue),
          },
        ],
        select: ['id', 'title', 'description', 'unitValue'],
      });
    });
  });
});
