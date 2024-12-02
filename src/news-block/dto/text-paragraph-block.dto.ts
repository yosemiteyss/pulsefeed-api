import { NewsBlock } from './news-block.dto';

/**
 * A block which represents a text paragraph.
 */
export class TextParagraphBlock extends NewsBlock {
  constructor(text: string) {
    super(TextParagraphBlock.identifier);
    this.text = text;
  }

  /**
   * The text of the text paragraph.
   */
  readonly text: string;

  /**
   * The text paragraph block type identifier.
   */
  static readonly identifier = '__text_paragraph__';
}
