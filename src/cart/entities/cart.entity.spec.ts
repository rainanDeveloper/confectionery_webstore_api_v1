import { randomUUID } from 'crypto';
import { CartEntity } from './cart.entity';
import { CartStatus } from '../enums/cart-status.enum';

describe('CartEntity', () => {
  it('Should create a new cart entity', () => {
    const nowMock = new Date();
    const newCart: CartEntity = new CartEntity();

    newCart.id = randomUUID();
    newCart.total = 0;
    newCart.status = CartStatus.OPEN;
    newCart.createdAt = nowMock;
    newCart.updatedAt = nowMock;

    expect(newCart).toBeInstanceOf(CartEntity);
  });
});
