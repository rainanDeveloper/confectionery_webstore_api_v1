import { randomUUID } from 'crypto';
import { ProductEntity } from './product.entity';

describe('ProductEntity', () => {
  it('should test the product entity', () => {
    const product = new ProductEntity();

    expect(product).toBeInstanceOf(ProductEntity);
  });

  describe('validateProduct', () => {
    it('should ensure the cost is not zero', () => {
      const product = new ProductEntity();

      product.id = randomUUID();
      product.title = 'Some Product';
      product.description = 'A simple test product';
      product.cost = 0;
      product.unitValue = 5;
      const now = new Date();
      product.createdAt = now;
      product.updatedAt = now;

      const executioner = () => {
        product.validateProduct();
      };

      expect(executioner).toThrowError();
    });

    it('should ensure the cost is not lower than zero', () => {
      const product = new ProductEntity();

      product.id = randomUUID();
      product.title = 'Some Product';
      product.description = 'A simple test product';
      product.cost = -4;
      product.unitValue = 5;
      const now = new Date();
      product.createdAt = now;
      product.updatedAt = now;

      const executioner = () => {
        product.validateProduct();
      };

      expect(executioner).toThrowError();
    });

    it('should ensure the unit value is not lower than the cost', () => {
      const product = new ProductEntity();

      product.id = randomUUID();
      product.title = 'Some Product';
      product.description = 'A simple test product';
      product.cost = 4;
      product.unitValue = 3;
      const now = new Date();
      product.createdAt = now;
      product.updatedAt = now;

      const executioner = () => {
        product.validateProduct();
      };

      expect(executioner).toThrowError();
    });

    it('should ensure the profit is ok', () => {
      const product = new ProductEntity();

      product.id = randomUUID();
      product.title = 'Some Product';
      product.description = 'A simple test product';
      product.cost = 3.44;
      product.unitValue = 5;
      const now = new Date();
      product.createdAt = now;
      product.updatedAt = now;

      product.validateProduct();

      expect(product.profitPercent).toStrictEqual(
        ((product.unitValue - product.cost) / product.unitValue) * 100,
      );
      expect(product.profit).toStrictEqual(
        (product.profitPercent * product.unitValue) / 100,
      );
    });
  });
});
