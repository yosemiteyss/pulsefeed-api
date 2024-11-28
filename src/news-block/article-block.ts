import { CategoryDto } from '../category/dto/category.dto';
import { ArticleDto } from '../article/dto/article.dto';
import { SourceDto } from '../source/dto/source.dto';
import { BlockAction } from './block-action';
import { NewsBlock } from './news-block';

/**
 * An abstract block which represents a post block.
 */
export abstract class ArticleBlock extends NewsBlock {
  /**
   * The newsletter block type identifier.
   */
  static readonly identifier: string = '__article_medium__';

  override readonly type: string = ArticleBlock.identifier;

  /**
   * Article data.
   */
  readonly article: ArticleDto;

  /**
   * The category of the article.
   */
  readonly category: CategoryDto;

  /**
   * The source of the article.
   */
  readonly source: SourceDto;

  /**
   * An optional action which occurs upon interaction.
   */
  readonly action?: BlockAction;

  /**
   * Whether this post requires a premium subscription to access.
   */
  readonly isPremium: boolean;

  /**
   * Whether the content of this post is overlaid on the image.
   */
  readonly isContentOverlaid: boolean;
}
