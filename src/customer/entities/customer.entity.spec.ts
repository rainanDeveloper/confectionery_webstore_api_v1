import { compareSync } from 'bcrypt';
import { CustomerEntity } from './customer.entity';

describe('CustomerEntity', () => {
  describe('hashPassword', () => {
    it('should hash the password successfully', async () => {
      const mockPass = 'some_pass';
      const customer = new CustomerEntity();

      customer.password = mockPass;

      customer.hashPassword();

      expect(compareSync(mockPass, customer.password)).toBeTruthy();
    });
  });
});
