import { BlockAction } from './block-action.dto';
import { PostBlock } from './post-block.dto';
import { CategoryDto } from '../../category';
import { ArticleDto } from '../../article';
import { SourceDto } from '../../source';

/**
 * A block which represents a small post block.
 */
export class PostSmallBlock extends PostBlock {
  constructor(
    article: ArticleDto,
    category: CategoryDto,
    source: SourceDto,
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
