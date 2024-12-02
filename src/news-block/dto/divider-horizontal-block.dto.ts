import { NewsBlock } from './news-block.dto';

/**
 * A block which represents a divider horizontal.
 */
export class DividerHorizontalBlock extends NewsBlock {
  constructor() {
    super(DividerHorizontalBlock.identifier);
  }

  /**
   * The divider horizontal block type identifier.
   */
  static readonly identifier = '__divider_horizontal__';
}
