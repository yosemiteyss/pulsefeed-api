import { NewsBlock } from './news-block';

/**
 * A block which represents a divider horizontal.
 */
export class DividerHorizontalBlock extends NewsBlock {
  /**
   * The divider horizontal block type identifier.
   */
  static readonly identifier: string = '__divider_horizontal__';

  override readonly type: string = DividerHorizontalBlock.identifier;
}
