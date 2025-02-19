import { TextLeadParagraphBlock } from '../text-lead-paragraph.block';

describe('TextLeadParagraphBlock', () => {
  it('should serialize TextLeadParagraphBlock to JSON correctly', () => {
    const block = new TextLeadParagraphBlock('text');
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: TextLeadParagraphBlock.identifier,
      text: 'text',
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
