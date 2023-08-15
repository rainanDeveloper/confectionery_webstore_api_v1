import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './dtos/create-product.dto';
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
});
