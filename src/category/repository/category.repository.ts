import { CategoryMapper } from './category.mapper';
import { ArticleCategory } from '@common/model';
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

  async getCategoryByLang(
    languageKey: string,
  ): Promise<{ key: string; title: string; priority: number }[]> {
    const result = await this.prismaService.articleCategoryTitle.findMany({
      include: {
        category: true,
        language: true,
      },
      where: {
        category: {
          enabled: true,
          articles: {
            some: {},
          },
        },
        language: {
          key: languageKey,
        },
      },
      orderBy: {
        category: {
          priority: 'desc',
        },
      },
    });

    return result.map((title) => {
      return {
        key: title.category.key,
        title: title.title,
        priority: title.category.priority.toNumber(),
      };
    });
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
