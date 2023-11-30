import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Between, Like, Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { SearchProductDto } from './dtos/search-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
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
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValueOnce(`200`),
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

      productMock.id = randomUUID();
      productMock.title = productDto.title;
      productMock.description = productDto.description;
      productMock.cost = productDto.cost;
      productMock.unitValue = productDto.unitValue;

      productMock.validateProduct();

      jest.spyOn(productRepository, 'create').mockReturnValueOnce(productMock);

      const newProduct = await productService.create(productDto);

      expect(newProduct).toBeDefined();
      expect(newProduct).toStrictEqual(productMock.id);
      expect(productRepository.create).toHaveBeenCalledTimes(1);
      expect(productRepository.create).toHaveBeenCalledWith(productDto);
      expect(productRepository.save).toHaveBeenCalledTimes(1);
      expect(productRepository.save).toHaveBeenCalledWith(productMock);
    });
  });

  describe('findOne', () => {
    it('should find a product sucessfully', async () => {
      const productId = randomUUID();

      const productMock: ProductEntity = {
        id: productId,
      } as ProductEntity;

      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValueOnce(productMock);

      const result = await productService.findOne(productId);

      expect(result).toStrictEqual(productMock);
      expect(productRepository.findOne).toHaveBeenCalledTimes(1);
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
        select: ['id', 'title', 'description', 'categories', 'unitValue'],
        relations: ['categories'],
        skip: 0,
        take: 200,
      });
    });

    it('it should do a pagination', async () => {
      const productsMock: ProductEntity[] = [new ProductEntity()];

      jest.spyOn(productRepository, 'find').mockResolvedValueOnce(productsMock);

      const products = await productService.findAll(5);

      expect(products).toStrictEqual(productsMock);
      expect(productRepository.find).toHaveBeenCalledTimes(1);
      expect(productRepository.find).toHaveBeenCalledWith({
        select: ['id', 'title', 'description', 'categories', 'unitValue'],
        relations: ['categories'],
        skip: 800,
        take: 200,
      });
    });
  });

  describe('search', () => {
    it('should search using searchterm', async () => {
      const productsMock: ProductEntity[] = [new ProductEntity()];

      jest.spyOn(productRepository, 'find').mockResolvedValueOnce(productsMock);

      const searchDto: SearchProductDto = {
        searchTerm: 'some search term',
        page: 1,
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
        skip: 0,
        take: 200,
      });
    });

    it('should add to search a unit value range', async () => {
      const productsMock: ProductEntity[] = [new ProductEntity()];

      jest.spyOn(productRepository, 'find').mockResolvedValueOnce(productsMock);

      const searchDto: SearchProductDto = {
        searchTerm: 'some search term',
        minUnitValue: 30,
        maxUnitValue: 100,
        page: 1,
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
        skip: 0,
        take: 200,
      });
    });

    it('should do a pagination', async () => {
      const productsMock: ProductEntity[] = [new ProductEntity()];

      jest.spyOn(productRepository, 'find').mockResolvedValueOnce(productsMock);

      const searchDto: SearchProductDto = {
        searchTerm: 'some search term',
        page: 4,
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
        skip: 600,
        take: 200,
      });
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const productMock = new ProductEntity() as any;

      const productDto: UpdateProductDto = {
        title: 'New title',
      };

      const prodId = randomUUID();

      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValueOnce(productMock);

      const result = await productService.update(prodId, productDto);

      expect(result).not.toBeDefined();
      expect(productRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(productRepository.findOneBy).toHaveBeenCalledWith({
        id: prodId,
      });
      expect(productRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException when the product is not found', async () => {
      const productDto: UpdateProductDto = {
        title: 'New title',
      };

      const prodId = randomUUID();

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValueOnce(null);

      const resultPromise = productService.update(prodId, productDto);

      expect(resultPromise).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a product sucessfully', async () => {
      const productId = randomUUID();

      jest.spyOn(productRepository, 'delete').mockResolvedValueOnce(null);

      await productService.delete(productId);
      expect(productRepository.delete).toHaveBeenCalledTimes(1);
      expect(productRepository.delete).toHaveBeenCalledWith({
        id: productId,
      });
    });
  });
});
