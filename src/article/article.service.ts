import { ArticleRepository } from './repository/article.repository';
import { ShuffleService } from '../shared/service/shuffle.service';
import { ArticleFindOptions } from './type/article-find-options';
import { HomeFeedRequestDto } from './dto/home-feed-request-dto';
import { LanguageService } from '../language/language.service';
import { CategoryService } from '../category/category.service';
import { HomeFeedDto, HomeFeedSection } from './dto/home-feed';
import { Injectable, NotFoundException } from '@nestjs/common';
import { roundDownToNearestHalfHour } from '@common/utils';
import { SourceDto } from '../source/dto/source.dto';
import { ArticleDto } from './dto/article.dto';
import { LoggerService } from '@common/logger';
import { PageResponse } from '@common/dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly logger: LoggerService,
    private readonly shuffleService: ShuffleService,
    private readonly languageService: LanguageService,
    private readonly categoryService: CategoryService,
  ) {}

  async getHomeFeed({ language }: HomeFeedRequestDto): Promise<HomeFeedDto> {
    const sections: HomeFeedSection[] = [];
    const excludeArticleIds: string[] = [];

    const categories = await this.categoryService.getSupportedCategories({ language });
    const topCategories = categories.sort((a, b) => b.priority! - a.priority!).slice(0, 5);

    for (const category of topCategories) {
      const { data } = await this.getArticlesByOpts({
        page: 1,
        limit: 10,
        category: category.key!,
        language: language,
        publishedBefore: ArticleService.getArticleRequestPublishedTime(),
      });

      sections.push({
        category: category,
        articles: data,
      });

      excludeArticleIds.push(...data.map((article) => article.id!));
    }

    return {
      sections,
      excludeArticleIds,
    };
  }

  async getArticlesByOpts(opts: ArticleFindOptions): Promise<PageResponse<ArticleDto>> {
    if (!this.categoryService.isSupportedCategory(opts.category)) {
      this.logger.warn(ArticleService.name, `category: ${opts.category} is not found`);
      throw new NotFoundException();
    }

    if (!this.languageService.isSupportedLanguage(opts.language)) {
      this.logger.warn(ArticleService.name, `language: ${opts.language} is not found`);
      throw new NotFoundException();
    }

    const [data, total] = await this.getFilteredArticlesFromDb(opts);
    this.logger.log(ArticleService.name, 'Load articles from db.');

    return { data, total, page: opts.page, limit: opts.limit };
  }

  /**
   * Get filtered articles from database.
   */
  private async getFilteredArticlesFromDb(
    opts: ArticleFindOptions,
  ): Promise<[ArticleDto[], number]> {
    const [items, total] = await this.articleRepository.getArticles(opts);

    let data: ArticleDto[] = items.map(({ article, source }) => {
      return {
        id: article.id,
        title: article.title,
        description: article.description,
        image: article.image,
        link: article.link,
        publishedAt: article.publishedAt ?? article.createdAt,
        source: SourceDto.fromModel(source),
      };
    });

    data = this.shuffleService.shuffleByKey(data, (article) => article.source?.id || 'unknown');

    return [data, total];
  }

  static getArticleRequestPublishedTime(): Date {
    return roundDownToNearestHalfHour(new Date());
  }
}
