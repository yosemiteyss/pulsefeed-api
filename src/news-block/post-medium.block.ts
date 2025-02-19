import { CategoryResponse } from '../category';
import { BlockAction } from './block-action';
import { ArticleResponse } from '../article';
import { SourceResponse } from '../source';
import { PostBlock } from './post.block';

/**
 * A block which represents a medium post block.
 */
export class PostMediumBlock extends PostBlock {
  constructor(
    article: ArticleResponse,
    category: CategoryResponse,
    source: SourceResponse,
    action: BlockAction,
    isPremium: boolean = false,
    isContentOverlaid: boolean = false,
  ) {
    super(
      PostMediumBlock.identifier,
      article,
      category,
      source,
      action,
      isPremium,
      isContentOverlaid,
    );
  }

  /**
   * The small post block type identifier.
   */
  static override readonly identifier = '__post_medium__';
}
