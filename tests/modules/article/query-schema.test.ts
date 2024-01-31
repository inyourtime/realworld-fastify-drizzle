import {
  baseArticleQuery,
  articleListQuery,
} from '../../../src/modules/article/schema';

describe('Test base article query', () => {
  // Verify that the baseArticleQuery object is created successfully.
  test('should create baseArticleQuery object successfully', () => {
    const result = baseArticleQuery.safeParse({ limit: '20', page: '1' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ limit: 20, page: 1 });
    }
  });
});
