import { BannerAdBlock, BannerAdSize } from '../banner-ad.block';

describe('BannerAdBlock', () => {
  it('should serialize to JSON correctly', () => {
    const block = new BannerAdBlock(BannerAdSize.Normal);

    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: BannerAdBlock.identifier,
      size: BannerAdSize.Normal,
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
