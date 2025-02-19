import { NewsBlock } from './news.block';

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
  constructor(size: BannerAdSize) {
    super(BannerAdBlock.identifier);
    this.size = size;
  }

  /**
   * The banner ad block type identifier.
   */
  static readonly identifier = '__banner_ad__';

  /**
   * The size of this banner ad.
   */
  readonly size: BannerAdSize;
}
