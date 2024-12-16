import { ArticleIntroductionBlock } from '../article-introduction-block.dto';
import { CategoryResponse } from '../../../category';
import { SourceResponse } from '../../../source';

describe('ArticleIntroductionBlock', () => {
  const categoryDto = new CategoryResponse('key', 'title', 1.0);
  const sourceDto = new SourceResponse('id', 'title', 'link', 'image', 'description');
  const publishedAt = new Date('2023-01-01T00:00:00Z');

  it('should serialize to JSON correctly', () => {
    const block = new ArticleIntroductionBlock(
      'Article Title',
      categoryDto,
      sourceDto,
      publishedAt,
      'image',
      true,
    );

    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: '__article_introduction__',
      title: 'Article Title',
      imageUrl: 'image',
      category: categoryDto,
      source: sourceDto,
      publishedAt: publishedAt.toISOString(),
      isPremium: true,
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
