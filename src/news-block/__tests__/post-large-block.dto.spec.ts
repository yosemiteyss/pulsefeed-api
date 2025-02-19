import { NavigateToArticleAction } from '../block-action';
import { PostLargeBlock } from '../post-large.block';
import { CategoryResponse } from '../../category';
import { ArticleResponse } from 'src/article';
import { SourceResponse } from 'src/source';

describe('PostLargeBlock', () => {
  it('should serialize PostLargeBlock to JSON correctly', () => {
    const publishedAt = new Date();
    const categoryDto = new CategoryResponse('key', 'title', 1.0);
    const sourceDto = new SourceResponse('id', 'title', 'link', 'image', 'description');
    const articleDto = new ArticleResponse(
      'id',
      'title',
      'link',
      'description',
      'image',
      'category',
      'source',
      publishedAt,
    );

    const block = new PostLargeBlock(
      articleDto,
      categoryDto,
      sourceDto,
      new NavigateToArticleAction(articleDto.id, articleDto.link),
    );
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: PostLargeBlock.identifier,
      article: {
        id: 'id',
        title: 'title',
        link: 'link',
        description: 'description',
        imageUrl: 'image',
        categoryKey: 'category',
        sourceId: 'source',
        publishedAt: articleDto.publishedAt?.toISOString(),
      },
      category: {
        key: 'key',
        title: 'title',
        priority: 1.0,
      },
      source: {
        id: 'id',
        title: 'title',
        link: 'link',
        imageUrl: 'image',
        description: 'description',
      },
      action: {
        type: NavigateToArticleAction.identifier,
        actionType: 0,
        articleId: 'id',
        articleUrl: 'link',
      },
      isPremium: false,
      isContentOverlaid: false,
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
