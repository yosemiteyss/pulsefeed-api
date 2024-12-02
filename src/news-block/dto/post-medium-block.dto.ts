import { BlockAction } from './block-action.dto';
import { PostBlock } from './post-block.dto';
import { CategoryDto } from '../../category';
import { ArticleDto } from '../../article';
import { SourceDto } from '../../source';

/**
 * A block which represents a medium post block.
 */
export class PostMediumBlock extends PostBlock {
  constructor(
    article: ArticleDto,
    category: CategoryDto,
    source: SourceDto,
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
