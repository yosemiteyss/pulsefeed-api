import { toCacheKeyPart } from '../cache.utils';
import { ArticleFilter } from 'src/article';

describe('toCacheKeyPart', () => {
  it('should generate a cache key for all fields', () => {
    const filter: ArticleFilter = {
      page: 1,
      limit: 10,
      languageKey: 'en',
      publishedBefore: new Date('2023-12-31'),
      categoryKey: 'news',
      sourceId: '123',
      excludeIds: ['456', '789'],
      searchTerm: 'example',
    };

    const result = toCacheKeyPart(filter);
    expect(result).toBe(
      'page:1:limit:10:languageKey:en:publishedBefore:2023-12-31T00:00:00.000Z:categoryKey:news:sourceId:123:excludeIds:456,789:searchTerm:example',
    );
  });

  it('should exclude optional fields when not provided', () => {
    const filter: ArticleFilter = {
      page: 2,
      limit: 5,
      languageKey: 'fr',
      publishedBefore: new Date('2024-01-01'),
    };

    const result = toCacheKeyPart(filter);
    expect(result).toBe('page:2:limit:5:languageKey:fr:publishedBefore:2024-01-01T00:00:00.000Z');
  });

  it('should handle empty excludeIds and searchTerm', () => {
    const filter: ArticleFilter = {
      page: 3,
      limit: 15,
      languageKey: 'de',
      publishedBefore: new Date('2024-06-01'),
      excludeIds: [],
    };

    const result = toCacheKeyPart(filter);
    expect(result).toBe('page:3:limit:15:languageKey:de:publishedBefore:2024-06-01T00:00:00.000Z');
  });

  it('should serialize excludeIds properly when provided', () => {
    const filter: ArticleFilter = {
      page: 4,
      limit: 20,
      languageKey: 'es',
      publishedBefore: new Date('2025-02-20'),
      excludeIds: ['111', '222'],
    };

    const result = toCacheKeyPart(filter);
    expect(result).toBe(
      'page:4:limit:20:languageKey:es:publishedBefore:2025-02-20T00:00:00.000Z:excludeIds:111,222',
    );
  });
});
