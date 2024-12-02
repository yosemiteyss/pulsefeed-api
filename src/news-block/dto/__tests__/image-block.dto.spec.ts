import { ImageBlock } from '../image-block.dto';

describe('ImageBlock', () => {
  it('should serialize ImageBlock to JSON correctly', () => {
    const block = new ImageBlock('imageUrl');
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: ImageBlock.identifier,
      imageUrl: 'imageUrl',
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
