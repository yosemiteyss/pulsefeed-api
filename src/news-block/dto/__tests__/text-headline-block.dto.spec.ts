import { TextHeadlineBlock } from '../text-headline-block.dto';

describe('TextHeadlineBlock', () => {
  it('should serialize TextHeadlineBlock to JSON correctly', () => {
    const block = new TextHeadlineBlock('text');
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: TextHeadlineBlock.identifier,
      text: 'text',
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
