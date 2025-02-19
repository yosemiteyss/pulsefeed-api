import { NewsBlock } from './news.block';

/**
 * A block which represents a newsletter.
 */
export class NewsletterBlock extends NewsBlock {
  constructor() {
    super(NewsletterBlock.identifier);
  }

  /**
   * The newsletter block type identifier.
   */
  static readonly identifier = '__newsletter__';
}
