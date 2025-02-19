import { TextCaptionBlock, TextCaptionColor } from '../text-caption.block';

describe('TextCaptionBlock', () => {
  it('should serialize TextCaptionBlock to JSON correctly', () => {
    const block = new TextCaptionBlock(TextCaptionColor.Normal, 'text');
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: TextCaptionBlock.identifier,
      color: TextCaptionColor.Normal,
      text: 'text',
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
