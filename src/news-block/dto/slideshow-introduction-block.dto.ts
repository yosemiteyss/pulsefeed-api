import { BlockAction } from './block-action.dto';
import { NewsBlock } from './news-block.dto';

/**
 * A block which represents a slideshow introduction.
 */
export class SlideshowIntroductionBlock extends NewsBlock {
  constructor(title: string, coverImageUrl: string, action: BlockAction) {
    super(SlideshowIntroductionBlock.identifier);
    this.title = title;
    this.coverImageUrl = coverImageUrl;
    this.action = action;
  }

  /**
   * The title of this slideshow.
   */
  readonly title: string;

  /**
   * The slideshow cover image URL.
   */
  readonly coverImageUrl: string;

  /**
   * An optional action which occurs upon interaction.
   */
  readonly action?: BlockAction;

  /**
   * The slideshow introduction block type identifier.
   */
  static readonly identifier = '__slideshow_introduction__';
}
