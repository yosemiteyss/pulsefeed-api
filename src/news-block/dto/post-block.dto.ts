import { BlockAction } from './block-action.dto';
import { NewsBlock } from './news-block.dto';
import { CategoryDto } from '../../category';
import { ArticleDto } from '../../article';
import { SourceDto } from '../../source';

/**
 * An abstract block which represents a post block.
 */
export abstract class PostBlock extends NewsBlock {
  protected constructor(
    type: string = PostBlock.identifier,
    article: ArticleDto,
    category: CategoryDto,
    source: SourceDto,
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
  readonly article: ArticleDto;

  /**
   * Category data.
   */
  readonly category: CategoryDto;

  /**
   * Source data.
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
