import { SlideBlock } from './slide.block';
import { NewsBlock } from './news.block';

/**
 * A block which represents a slideshow.
 */
export class SlideshowBlock extends NewsBlock {
  constructor(title: string, slides: SlideBlock[]) {
    super(SlideshowBlock.identifier);
    this.title = title;
    this.slides = slides;
  }

  /**
   * The title of this slideshow.
   */
  readonly title: string;

  /**
   * List of slides to be displayed.
   */
  readonly slides: SlideBlock[];

  /**
   * The slideshow block type identifier.
   */
  static readonly identifier = '__slideshow__';
}
