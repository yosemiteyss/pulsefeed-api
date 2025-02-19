import { NewsBlock } from './news.block';

/**
 * A block which represents HTML content.
 */
export class HtmlBlock extends NewsBlock {
  constructor(content: string) {
    super(HtmlBlock.identifier);
    this.content = content;
  }

  /**
   * The HTML block type identifier.
   */
  static readonly identifier = '__html__';

  /**
   * The html content.
   */
  readonly content: string;
}
