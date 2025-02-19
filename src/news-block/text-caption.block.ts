import { NewsBlock } from './news.block';

/**
 * The text color of {@link TextCaptionBlock}.
 */
export enum TextCaptionColor {
  /**
   * The normal text color.
   */
  Normal,

  /**
   * The light text color.
   */
  Light,
}

/**
 * A block which represents a text caption.
 */
export class TextCaptionBlock extends NewsBlock {
  constructor(color: TextCaptionColor, text: string) {
    super(TextCaptionBlock.identifier);
    this.color = color;
    this.text = text;
  }

  /**
   * The color of this text caption.
   */
  readonly color: TextCaptionColor;

  /**
   * The text of this text caption.
   */
  readonly text: string;

  /**
   * The text caption block type identifier.
   */
  static readonly identifier = '__text_caption__';
}
