import { compareSync } from 'bcrypt';
import { UserEntity } from './user.entity';

describe('UserEntity', () => {
  describe('hashPassword', () => {
    it('should hash the password successfully', async () => {
      const mockPass = 'some_pass';
      const user = new UserEntity();
      user.password = mockPass;

      user.hashPassword();

      expect(compareSync(mockPass, user.password)).toBeTruthy();
    });
  });
});
