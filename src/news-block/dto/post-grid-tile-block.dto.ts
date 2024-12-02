import { BlockAction } from './block-action.dto';
import { PostBlock } from './post-block.dto';
import { CategoryDto } from '../../category';
import { ArticleDto } from '../../article';
import { SourceDto } from '../../source';

/**
 * A block which represents an article grid tile block.
 *
 * Multiple {@link PostGridTileBlock} blocks form a {@link PostGridGroupBlock}.
 */
export class PostGridTileBlock extends PostBlock {
  constructor(
    article: ArticleDto,
    category: CategoryDto,
    source: SourceDto,
    action: BlockAction,
    isPremium: boolean = false,
    isContentOverlaid: boolean = false,
  ) {
    super(
      PostGridTileBlock.identifier,
      article,
      category,
      source,
      action,
      isPremium,
      isContentOverlaid,
    );
  }

  /**
   * The article grid tile block type identifier.
   */
  static override readonly identifier = '__post_grid_tile__';
}
