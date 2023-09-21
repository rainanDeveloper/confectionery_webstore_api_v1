import { OrderEntity } from './order.entity';

describe('OrderEntity', () => {
  it('should test the order entity', () => {
    const order = new OrderEntity();

    expect(order).toBeInstanceOf(OrderEntity);
  });
});
