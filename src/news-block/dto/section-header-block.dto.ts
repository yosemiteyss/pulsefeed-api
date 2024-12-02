import { BlockAction } from './block-action.dto';
import { NewsBlock } from './news-block.dto';

/**
 * A block which represents a section header.
 */
export class SectionHeaderBlock extends NewsBlock {
  constructor(title: string, action?: BlockAction) {
    super(SectionHeaderBlock.identifier);
    this.title = title;
    this.action = action;
  }

  /**
   * The title of the section header.
   */
  readonly title: string;

  /**
   * An optional action which occurs upon interaction.
   */
  readonly action?: BlockAction;

  /**
   * The section header block type identifier.
   */
  static readonly identifier = '__section_header__';
}
