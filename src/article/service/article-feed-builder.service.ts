import {
  BannerAdBlock,
  BannerAdSize,
  NavigateToArticleAction,
  NavigateToFeedCategoryAction,
  NewsBlock,
  PostGridGroupBlock,
  PostGridTileBlock,
  PostSmallBlock,
  SectionHeaderBlock,
  SpacerBlock,
  Spacing,
} from '../../news-block';
import { ArticleCategory, ArticleCategoryTitle } from '@pulsefeed/common';
import { CategoryResponse } from '../../category';
import { SourceResponse } from '../../source';
import { Injectable } from '@nestjs/common';
import { ArticleResponse } from '../dto';
import { ArticleData } from '../model';

@Injectable()
export class ArticleFeedBuilder {
  buildLatestFeedPage(
    articles: ArticleData[],
    category: ArticleCategory,
    categoryTitle: ArticleCategoryTitle,
    includeTopSpacing: boolean = false,
    includeAds: boolean = true,
  ): NewsBlock[] {
    const blockList: NewsBlock[] = [];

    if (includeTopSpacing) {
      blockList.push(new SpacerBlock(Spacing.Small));
    }

    // Build news blocks for a specific category.
    const categoryKey = category.key;

    // Add section header.
    const categoryHeader = new SectionHeaderBlock(
      categoryTitle.title,
      new NavigateToFeedCategoryAction(categoryKey),
    );
    blockList.push(categoryHeader);

    // Add section grid (Get 3 articles with image for a grid).
    const articlesWithImage = articles.filter((data) => data.article.image !== undefined);
    const gridItemsCount = 3;
    const gridItems = articlesWithImage.slice(0, gridItemsCount);
    const gridBlock = new PostGridGroupBlock(
      CategoryResponse.fromModel(category, categoryTitle),
      gridItems.map((item) => {
        return new PostGridTileBlock(
          ArticleResponse.fromModel(item.article),
          CategoryResponse.fromModel(item.category, categoryTitle),
          SourceResponse.fromModel(item.source),
          new NavigateToArticleAction(item.article.id),
        );
      }),
    );
    blockList.push(gridBlock);

    // Add section remained articles.
    const gridItemIds = gridItems.map((data) => data.article.id);
    const listItems = articles.filter((data) => !gridItemIds.includes(data.article.id));
    for (let i = 0; i < listItems.length; i++) {
      const item = listItems[i];
      const block = new PostSmallBlock(
        ArticleResponse.fromModel(item.article),
        CategoryResponse.fromModel(item.category, categoryTitle),
        SourceResponse.fromModel(item.source),
        new NavigateToArticleAction(item.article.id),
      );
      blockList.push(block);

      // Insert ads for between every 10 articles.
      if (includeAds) {
        if (i % 10 === 0) {
          blockList.push(new BannerAdBlock(BannerAdSize.Normal));
        }
      }
    }

    return blockList;
  }

  buildCategoryFeedPage(
    articles: ArticleData[],
    categoryTitle: ArticleCategoryTitle,
    includeTopSpacing: boolean = false,
    includeAds: boolean = true,
  ): NewsBlock[] {
    const blockList: NewsBlock[] = [];

    // Insert top spacing.
    if (includeTopSpacing) {
      blockList.push(new SpacerBlock(Spacing.Small));
    }

    for (let i = 0; i < articles.length; i++) {
      const item = articles[i];
      const block = new PostSmallBlock(
        ArticleResponse.fromModel(item.article),
        CategoryResponse.fromModel(item.category, categoryTitle),
        SourceResponse.fromModel(item.source),
        new NavigateToArticleAction(item.article.id),
      );
      blockList.push(block);

      // Insert ads for between every 10 articles.
      if (includeAds) {
        if (i % 10 === 0) {
          blockList.push(new BannerAdBlock(BannerAdSize.Normal));
        }
      }
    }

    return blockList;
  }
}

// export type LatestFeedSection = CategorySection | ArticleSection;
//
// export interface CategorySection {
//   readonly type: 'category';
//   readonly categoryKey: string;
// }
//
// export interface ArticleSection {
//   readonly type: 'article';
// }
