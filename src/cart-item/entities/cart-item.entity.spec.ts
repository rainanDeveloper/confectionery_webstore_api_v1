import { randomUUID } from 'crypto';
import { CartItemEntity } from './cart-item.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { CartEntity } from 'src/cart/entities/cart.entity';

describe('CartItemEntity', () => {
  it('Should create a new cart item entity', () => {
    const nowMock = new Date();
    const newCartItem: CartItemEntity = new CartItemEntity();

    newCartItem.id = randomUUID();
    newCartItem.product = new ProductEntity();
    newCartItem.cart = new CartEntity();
    newCartItem.total = 0;
    newCartItem.createdAt = nowMock;
    newCartItem.updatedAt = nowMock;

    expect(newCartItem).toBeInstanceOf(CartItemEntity);
  });
});
