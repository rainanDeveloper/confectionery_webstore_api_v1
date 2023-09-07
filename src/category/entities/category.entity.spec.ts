import { CategoryEntity } from './category.entity';

describe('CategoryEntity', () => {
  it('should test the category entity', async () => {
    const categoryEntity = new CategoryEntity();

    expect(categoryEntity).toBeInstanceOf(CategoryEntity);
  });
});
