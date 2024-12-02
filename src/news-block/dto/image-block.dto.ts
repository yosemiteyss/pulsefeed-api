import { NewsBlock } from './news-block.dto';

/**
 * A block which represents an image.
 */
export class ImageBlock extends NewsBlock {
  constructor(imageUrl: string) {
    super(ImageBlock.identifier);
    this.imageUrl = imageUrl;
  }

  /**
   * The image block type identifier.
   */
  static readonly identifier = '__image__';

  /**
   * The url of this image.
   */
  readonly imageUrl: string;
}
