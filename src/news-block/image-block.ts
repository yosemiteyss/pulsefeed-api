import { NewsBlock } from './news-block';

/**
 * A block which represents an image.
 */
export class ImageBlock extends NewsBlock {
  /**
   * The image block type identifier.
   */
  static readonly identifier: string = '__image__';

  override readonly type: string = ImageBlock.identifier;

  /**
   * The url of this image.
   */
  readonly imageUrl: string;
}
