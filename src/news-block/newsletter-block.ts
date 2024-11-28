import { NewsBlock } from './news-block';

/**
 * A block which represents a newsletter.
 */
export class NewsletterBlock extends NewsBlock {
  /**
   * The newsletter block type identifier.
   */
  static readonly identifier: string = '__newsletter__';

  override readonly type: string = NewsletterBlock.identifier;
}
