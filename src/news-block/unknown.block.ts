import { NewsBlock } from './news.block';

/**
 * A block which represents an unknown type.
 */
export class UnknownBlock extends NewsBlock {
  constructor() {
    super(UnknownBlock.identifier);
  }

  /**
   * The unknown block type identifier.
   */
  static readonly identifier = '__unknown__';
}
