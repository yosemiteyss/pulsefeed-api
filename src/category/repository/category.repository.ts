import { ArticleCategory, ArticleCategoryTitle } from '@common/model';
import { CategoryMapper } from './category.mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/db';

@Injectable()
export class CategoryRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoryMapper: CategoryMapper,
  ) {}

  async getCategoryByKey(key: string): Promise<ArticleCategory | undefined> {
    const result = await this.prismaService.articleCategory.findFirst({
      where: {
        key: key,
      },
    });

    if (!result) {
      return undefined;
    }

    return this.categoryMapper.categoryEntityToModel(result);
  }

  async getEnabledCategories(): Promise<ArticleCategory[]> {
    const result = await this.prismaService.articleCategory.findMany({
      where: {
        enabled: true,
      },
    });

    return result.map((category) => this.categoryMapper.categoryEntityToModel(category));
  }

  async getCategoryTitlesByLang(languageKey: string): Promise<ArticleCategoryTitle[]> {
    const result = await this.prismaService.articleCategoryTitle.findMany({
      where: {
        category: {
          enabled: true,
        },
        languageKey: languageKey,
      },
    });

    return result.map((title) => this.categoryMapper.categoryTitleEntityToModel(title));
  }

  async setCategoryEnabled(key: string, enabled: boolean) {
    await this.prismaService.articleCategory.update({
      where: {
        key: key,
      },
      data: {
        enabled: enabled,
      },
    });
  }
}
