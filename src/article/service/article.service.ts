import { Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { roundDownToNearestHalfHour, CacheService } from '@pulsefeed/common';
import { ArticleResult, ArticleListOptions, FeedResult } from '../model';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ArticleRepository } from '../repository';
import { CategoryService } from '../../category';
import { LanguageService } from '../../language';
import { ShuffleService } from '../../shared';
import { ArticleSectionDto } from '../dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private readonly shuffleService: ShuffleService,
    private readonly languageService: LanguageService,
    private readonly categoryService: CategoryService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Returns home feed.
   * @param langKey the language key.
   * @param sectionKey the section key.
   */
  async getFeed(langKey: string, sectionKey?: string): Promise<FeedResult> {
    const categories = await this.categoryService.getTranslatedCategories(langKey);
    const topCategories = categories.sort((a, b) => b.priority! - a.priority!).slice(0, 5);

    // Find category section index.
    let index: number;
    if (!sectionKey) {
      index = 0;
    } else {
      index = topCategories.findIndex((category) => category.key === sectionKey);
    }

    const category = topCategories[index];

    const [data] = await this.getArticlesByOpts({
      page: 1,
      limit: 10,
      category: category.key!,
      language: langKey,
      publishedBefore: ArticleService.getArticleRequestPublishedTime(),
    });

    const nextSection = index + 1 >= topCategories.length ? undefined : topCategories[index + 1];

    this.logger.log(
      `current index: ${index}, nextSection: ${nextSection?.key}`,
      ArticleService.name,
    );

    return {
      category: category,
      articles: data,
      nextSectionKey: nextSection?.key,
    };
  }

  /**
   * Returns article list.
   * @param opts the options for filtering articles.
   * @param excludeFeedArticles true to exclude articles already presented in feed.
   */
  async getArticles(
    opts: ArticleListOptions,
    excludeFeedArticles: boolean,
  ): Promise<[ArticleResult[], number]> {
    if (excludeFeedArticles) {
      const sections =
        await this.cacheService.getByPrefix<ArticleSectionDto>('pf:article:feed:request');
      const articleIds = sections.flatMap((feed) => feed.articles).map((article) => article.id);

      opts = { ...opts, excludeIds: articleIds };
    }

    return this.getArticlesByOpts(opts);
  }

  private async getArticlesByOpts(opts: ArticleListOptions): Promise<[ArticleResult[], number]> {
    if (opts.category && !this.categoryService.isSupportedCategory(opts.category)) {
      this.logger.error(`category: ${opts.category} is not found`, ArticleService.name);
      throw new NotFoundException();
    }

    if (!this.languageService.isSupportedLanguage(opts.language)) {
      this.logger.error(`language: ${opts.language} is not found`, ArticleService.name);
      throw new NotFoundException();
    }

    const [articles, total] = await this.articleRepository.getArticles(opts);
    this.logger.log(
      `Load articles from db, size: ${articles.length}, total: ${total}`,
      ArticleService.name,
    );

    const shuffled = this.shuffleService.shuffleByKey(articles, (article) => article.source.id);

    return [shuffled, total];
  }

  static getArticleRequestPublishedTime(): Date {
    return roundDownToNearestHalfHour(new Date());
  }
}
