import { OrderItemEntity } from './order-item.entity';

describe('OrderItemEntity', () => {
  it('should test order item entity', () => {
    const orderItem = new OrderItemEntity();

    expect(orderItem).toBeInstanceOf(OrderItemEntity);
  });
});
