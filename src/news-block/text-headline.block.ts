import { NewsBlock } from './news.block';

/**
 * A block which represents a text headline.
 */
export class TextHeadlineBlock extends NewsBlock {
  constructor(text: string) {
    super(TextHeadlineBlock.identifier);
    this.text = text;
  }

  /**
   * The text of the text headline.
   */
  readonly text: string;

  /**
   * The text headline block type identifier.
   */
  static readonly identifier = '__text_headline__';
}
