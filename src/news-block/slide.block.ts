import { NewsBlock } from './news.block';

/**
 * A block which represents a slide in a slideshow.
 */
export class SlideBlock extends NewsBlock {
  constructor(caption: string, description: string, photoCredit: string, imageUrl: string) {
    super(SlideBlock.identifier);
    this.caption = caption;
    this.description = description;
    this.photoCredit = photoCredit;
    this.imageUrl = imageUrl;
  }

  /**
   * The caption of the slide image.
   */
  readonly caption: string;

  /**
   * The description of the slide.
   */
  readonly description: string;

  /**
   * The photo credit for the slide image.
   */
  readonly photoCredit: string;

  /**
   * The URL of the slide image.
   */
  readonly imageUrl: string;

  /**
   * The slide block type identifier.
   */
  static readonly identifier = '__slide_block__';
}
