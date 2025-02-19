import { CategoryResponse } from '../category';
import { BlockAction } from './block-action';
import { ArticleResponse } from '../article';
import { SourceResponse } from '../source';
import { NewsBlock } from './news.block';

/**
 * An abstract block which represents a post block.
 */
export abstract class PostBlock extends NewsBlock {
  protected constructor(
    type: string,
    article: ArticleResponse,
    category: CategoryResponse,
    source: SourceResponse,
    action: BlockAction,
    isPremium: boolean = false,
    isContentOverlaid: boolean = false,
  ) {
    super(type);
    this.article = article;
    this.category = category;
    this.source = source;
    this.action = action;
    this.isPremium = isPremium;
    this.isContentOverlaid = isContentOverlaid;
  }

  /**
   * The newsletter block type identifier.
   */
  static readonly identifier: string = '__post_medium__';

  /**
   * Article data.
   */
  readonly article: ArticleResponse;

  /**
   * Category data.
   */
  readonly category: CategoryResponse;

  /**
   * Source data.
   */
  readonly source: SourceResponse;

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
