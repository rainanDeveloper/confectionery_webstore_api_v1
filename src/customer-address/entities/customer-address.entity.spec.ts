import { CustomerAddressEntity } from './customer-address.entity';

describe('CustomerAddressEntity', () => {
  it('should test customer address entity', () => {
    const customerAddress = new CustomerAddressEntity();

    expect(customerAddress).toBeInstanceOf(CustomerAddressEntity);
  });
});
