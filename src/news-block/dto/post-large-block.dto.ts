import { BlockAction } from './block-action.dto';
import { PostBlock } from './post-block.dto';
import { CategoryDto } from '../../category';
import { ArticleDto } from '../../article';
import { SourceDto } from '../../source';

/**
 * A block which represents a large post block.
 */
export class PostLargeBlock extends PostBlock {
  constructor(
    article: ArticleDto,
    category: CategoryDto,
    source: SourceDto,
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
