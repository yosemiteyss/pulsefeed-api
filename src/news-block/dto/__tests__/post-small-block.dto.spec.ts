import { BlockActionType, NavigateToArticleAction } from '../block-action.dto';
import { PostSmallBlock } from '../post-small-block.dto';
import { CategoryDto } from '../../../category';
import { ArticleDto } from '../../../article';
import { SourceDto } from '../../../source';

describe('PostSmallBlock', () => {
  it('should serialize PostSmallBlock to JSON correctly', () => {
    const publishedAt = new Date();
    const categoryDto = new CategoryDto('key', 'name', 1.0);
    const sourceDto = new SourceDto('id', 'title', 'link', 'image', 'description');
    const articleDto = new ArticleDto(
      'id',
      'title',
      'link',
      'description',
      'image',
      'category',
      'source',
      publishedAt,
    );

    const block = new PostSmallBlock(
      articleDto,
      categoryDto,
      sourceDto,
      new NavigateToArticleAction(BlockActionType.Navigation, articleDto.id),
    );
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: PostSmallBlock.identifier,
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
        name: 'name',
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
      },
      isPremium: false,
      isContentOverlaid: false,
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
