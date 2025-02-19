import { CategoryResponse } from '../category';
import { BlockAction } from './block-action';
import { ArticleResponse } from '../article';
import { SourceResponse } from '../source';
import { PostBlock } from './post.block';

/**
 * A block which represents an article grid tile block.
 *
 * Multiple {@link PostGridTileBlock} blocks form a {@link PostGridGroupBlock}.
 */
export class PostGridTileBlock extends PostBlock {
  constructor(
    article: ArticleResponse,
    category: CategoryResponse,
    source: SourceResponse,
    action: BlockAction,
    isPremium: boolean = false,
  ) {
    super(PostGridTileBlock.identifier, article, category, source, action, isPremium, true);
  }

  /**
   * The article grid tile block type identifier.
   */
  static override readonly identifier = '__post_grid_tile__';
}
