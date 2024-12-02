import { BlockActionType, NavigateToArticleAction } from '../block-action.dto';
import { PostMediumBlock } from '../post-medium-block.dto';
import { CategoryDto } from '../../../category';
import { ArticleDto } from '../../../article';
import { SourceDto } from '../../../source';

describe('PostMediumBlock', () => {
  it('should serialize PostMediumBlock to JSON correctly', () => {
    const publishedAt = new Date();
    const categoryDto = new CategoryDto('key', 'name', 1.0);
    const sourceDto = new SourceDto('id', 'title', 'link', 'image', 'description');
    const articleDto = new ArticleDto(
      'id',
      'title',
      'link',
      'description',
      'image',
      sourceDto,
      publishedAt,
    );

    const block = new PostMediumBlock(
      articleDto,
      categoryDto,
      sourceDto,
      new NavigateToArticleAction(BlockActionType.Navigation, articleDto.id),
    );
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: PostMediumBlock.identifier,
      article: {
        id: 'id',
        title: 'title',
        link: 'link',
        description: 'description',
        image: 'image',
        publishedAt: articleDto.publishedAt?.toISOString(),
        source: {
          id: 'id',
          title: 'title',
          link: 'link',
          image: 'image',
          description: 'description',
        },
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
        image: 'image',
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
