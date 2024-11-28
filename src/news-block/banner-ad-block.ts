import { NewsBlock } from './news-block';

export enum BannerAdSize {
  /**
   *  The normal size of a banner ad.
   */
  Normal,

  /**
   * The large size of a banner ad.
   */
  Large,

  /**
   * The large size of a banner ad.
   */
  ExtraLarge,

  /**
   * The anchored adaptive size of a banner ad.
   */
  AnchoredAdaptive,
}

/**
 * A block which represents a banner ad.
 */
export class BannerAdBlock extends NewsBlock {
  /**
   * The banner ad block type identifier.
   */
  static readonly identifier: string = '__banner_ad__';

  override readonly type: string = BannerAdBlock.identifier;

  /**
   * The size of this banner ad.
   */
  readonly size: BannerAdSize;
}
