import { ArticleRepository } from './repository/article.repository';
import { ShuffleService } from '../shared/service/shuffle.service';
import { CategoryResult } from '../category/type/category-result';
import { ArticleFindOptions } from './type/article-find-options';
import { LanguageService } from '../language/language.service';
import { CategoryService } from '../category/category.service';
import { roundDownToNearestHalfHour } from '@pulsefeed/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleSectionDto } from './dto/article-section.dto';
import { ArticleResult } from './type/article-result';
import { LoggerService } from '@pulsefeed/common';
import { CacheService } from '@pulsefeed/common';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly logger: LoggerService,
    private readonly shuffleService: ShuffleService,
    private readonly languageService: LanguageService,
    private readonly categoryService: CategoryService,
    private readonly cacheService: CacheService,
  ) {}

  async getHomeFeed(
    langKey: string,
    sectionKey?: string,
  ): Promise<{
    category: CategoryResult;
    articles: ArticleResult[];
    nextSectionKey?: string;
  }> {
    const categories = await this.categoryService.getSupportedCategories(langKey);
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
      ArticleService.name,
      `current index: ${index}, nextSection: ${nextSection?.key}`,
    );

    return {
      category: category,
      articles: data,
      nextSectionKey: nextSection?.key,
    };
  }

  async getArticleList(
    opts: ArticleFindOptions,
    excludeHomeArticles: boolean,
  ): Promise<[ArticleResult[], number]> {
    if (excludeHomeArticles) {
      const sections =
        await this.cacheService.getByPrefix<ArticleSectionDto>('pf:article:home:request');
      const articleIds = sections.flatMap((feed) => feed.articles).map((article) => article.id);

      opts = { ...opts, excludeIds: articleIds };
    }

    return this.getArticlesByOpts(opts);
  }

  private async getArticlesByOpts(opts: ArticleFindOptions): Promise<[ArticleResult[], number]> {
    if (opts.category && !this.categoryService.isSupportedCategory(opts.category)) {
      this.logger.warn(ArticleService.name, `category: ${opts.category} is not found`);
      throw new NotFoundException();
    }

    if (!this.languageService.isSupportedLanguage(opts.language)) {
      this.logger.warn(ArticleService.name, `language: ${opts.language} is not found`);
      throw new NotFoundException();
    }

    const [data, total] = await this.getFilteredArticlesFromDb(opts);
    this.logger.log(ArticleService.name, 'Load articles from db.');

    return [data, total];
  }

  /**
   * Get filtered articles from database.
   */
  private async getFilteredArticlesFromDb(
    opts: ArticleFindOptions,
  ): Promise<[ArticleResult[], number]> {
    const [items, total] = await this.articleRepository.getArticles(opts);
    const shuffled = this.shuffleService.shuffleByKey(items, (article) => article.source.id);
    return [shuffled, total];
  }

  static getArticleRequestPublishedTime(): Date {
    return roundDownToNearestHalfHour(new Date());
  }
}
