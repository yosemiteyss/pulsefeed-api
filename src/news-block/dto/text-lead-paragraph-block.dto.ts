import { NewsBlock } from './news-block.dto';

/**
 * A block which represents a text lead paragraph.
 */
export class TextLeadParagraphBlock extends NewsBlock {
  constructor(text: string) {
    super(TextLeadParagraphBlock.identifier);
    this.text = text;
  }

  /**
   * The text of the text lead paragraph.
   */
  readonly text: string;

  /**
   * The text lead paragraph block type identifier.
   */
  static readonly identifier = '__text_lead_paragraph__';
}
