import { ArticleIntroductionBlock } from '../article-introduction-block.dto';
import { CategoryDto } from '../../../category';
import { SourceDto } from '../../../source';

describe('ArticleIntroductionBlock', () => {
  const categoryDto = new CategoryDto('key', 'category', 1.0);
  const sourceDto = new SourceDto('id', 'title', 'link', 'image', 'description');
  const publishedAt = new Date('2023-01-01T00:00:00Z');

  it('should serialize to JSON correctly', () => {
    const block = new ArticleIntroductionBlock(
      'Article Title',
      'https://example.com/image.jpg',
      categoryDto,
      sourceDto,
      publishedAt,
      true,
    );

    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: '__article_introduction__',
      title: 'Article Title',
      imageUrl: 'https://example.com/image.jpg',
      category: categoryDto,
      source: sourceDto,
      publishedAt: publishedAt.toISOString(),
      isPremium: true,
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
