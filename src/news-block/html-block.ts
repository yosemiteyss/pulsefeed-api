import { NewsBlock } from './news-block';

/**
 * A block which represents HTML content.
 */
export class HtmlBlock extends NewsBlock {
  /**
   * The HTML block type identifier.
   */
  static readonly identifier: string = '__html__';

  override readonly type: string = HtmlBlock.identifier;

  /**
   * The html content.
   */
  readonly content: string;
}
