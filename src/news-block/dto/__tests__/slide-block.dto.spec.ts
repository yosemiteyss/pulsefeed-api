import { SlideBlock } from '../slide-block.dto';

describe('SlideBlock', () => {
  it('should serialize SlideBlock to JSON correctly', () => {
    const block = new SlideBlock('caption', 'description', 'photoCredit', 'imageUrl');
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: SlideBlock.identifier,
      caption: 'caption',
      description: 'description',
      photoCredit: 'photoCredit',
      imageUrl: 'imageUrl',
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
