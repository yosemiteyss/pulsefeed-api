import { ArticleResponse } from '../../article/dto';
import { CategoryResponse } from '../../category';
import { BlockAction } from './block-action.dto';
import { SourceResponse } from '../../source';
import { PostBlock } from './post-block.dto';

/**
 * A block which represents a large post block.
 */
export class PostLargeBlock extends PostBlock {
  constructor(
    article: ArticleResponse,
    category: CategoryResponse,
    source: SourceResponse,
    action: BlockAction,
    isPremium: boolean = false,
    isContentOverlaid: boolean = false,
  ) {
    super(
      PostLargeBlock.identifier,
      article,
      category,
      source,
      action,
      isPremium,
      isContentOverlaid,
    );
  }

  /**
   * The large post block type identifier.
   */
  static override readonly identifier = '__post_large__';
}
