import {
  ArticleCategory as CategoryEntity,
  ArticleCategoryTitle as CategoryTitleEntity,
} from '@prisma/client';
import { ArticleCategory, ArticleCategoryTitle } from '@common/model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryMapper {
  categoryEntityToModel(entity: CategoryEntity): ArticleCategory {
    return {
      key: entity.key,
    };
  }

  categoryTitleEntityToModel(entity: CategoryTitleEntity): ArticleCategoryTitle {
    return {
      categoryKey: entity.categoryKey,
      title: entity.title,
    };
  }
}
