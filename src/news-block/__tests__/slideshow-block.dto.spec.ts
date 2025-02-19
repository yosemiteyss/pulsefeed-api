import { SlideshowBlock } from '../slideshow.block';
import { SlideBlock } from '../slide.block';

describe('SlideshowBlock', () => {
  it('should serialize SlideshowBlock to JSON correctly', () => {
    const block = new SlideshowBlock('title', [
      new SlideBlock('caption', 'description', 'photoCredit', 'imageUrl'),
    ]);
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: SlideshowBlock.identifier,
      title: 'title',
      slides: [
        {
          type: SlideBlock.identifier,
          caption: 'caption',
          description: 'description',
          photoCredit: 'photoCredit',
          imageUrl: 'imageUrl',
        },
      ],
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
