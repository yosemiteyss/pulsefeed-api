import { CategoryResponse } from '../category';
import { BlockAction } from './block-action';
import { ArticleResponse } from '../article';
import { SourceResponse } from '../source';
import { PostBlock } from './post.block';

/**
 * A block which represents a small post block.
 */
export class PostSmallBlock extends PostBlock {
  constructor(
    article: ArticleResponse,
    category: CategoryResponse,
    source: SourceResponse,
    action: BlockAction,
    isPremium: boolean = false,
  ) {
    super(PostSmallBlock.identifier, article, category, source, action, isPremium, false);
  }

  /**
   * The small post block type identifier.
   */
  static override readonly identifier = '__post_small__';
}
