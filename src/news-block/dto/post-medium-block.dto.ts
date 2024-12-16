import { CategoryResponse } from '../../category';
import { BlockAction } from './block-action.dto';
import { ArticleResponse } from 'src/article';
import { PostBlock } from './post-block.dto';
import { SourceResponse } from 'src/source';

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
