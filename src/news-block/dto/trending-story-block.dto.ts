import { PostSmallBlock } from './post-small-block.dto';
import { NewsBlock } from './news-block.dto';

/**
 * A block which represents a trending story.
 */
export class TrendingStoryBlock extends NewsBlock {
  constructor(content: PostSmallBlock) {
    super(TrendingStoryBlock.identifier);
    this.content = content;
  }

  /**
   * The content of the trending story.
   */
  readonly content: PostSmallBlock;

  /**
   * The trending story block type identifier.
   */
  static readonly identifier = '__trending_story__';
}
