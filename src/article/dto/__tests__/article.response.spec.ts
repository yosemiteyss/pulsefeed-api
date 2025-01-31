import { Article, ArticleCategoryEnum, LanguageEnum } from '@pulsefeed/common';
import { ArticleResponse } from '../article.response';

describe('ArticleResponse', () => {
  it('should exclude description if article has image', () => {
    const article: Article = {
      id: 'id',
      title: 'title',
      description: 'description',
      category: ArticleCategoryEnum.HEALTH,
      sourceId: 'sourceId',
      image: 'image',
      link: 'link',
      languages: [LanguageEnum.en_us],
    };

    const response = ArticleResponse.fromModel(article);

    expect(response.description).toBeUndefined();
  });
});
