import { NewsBlock } from './news.block';

/**
 * The spacing of {@link SpacerBlock}.
 */
export enum Spacing {
  /**
   * The extra small spacing.
   */
  ExtraSmall,

  /**
   * The small spacing.
   */
  Small,

  /**
   * The medium spacing.
   */
  Medium,

  /**
   * The large spacing.
   */
  Large,

  /**
   * The very large spacing.
   */
  VeryLarge,

  /**
   * The extra large spacing.
   */
  ExtraLarge,
}

/**
 * A block which represents a spacer.
 */
export class SpacerBlock extends NewsBlock {
  constructor(spacing: Spacing) {
    super(SpacerBlock.identifier);
    this.spacing = spacing;
  }

  /**
   * The spacing of this spacer.
   */
  readonly spacing: Spacing;

  /**
   * The spacer block type identifier.
   */
  static readonly identifier = '__spacer__';
}
