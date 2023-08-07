import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
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

      jest.spyOn(productRepository, 'create').mockReturnValueOnce(productMock);

      const newProduct = await productService.create(productDto);

      expect(newProduct).toBeDefined();
    });
  });
});
