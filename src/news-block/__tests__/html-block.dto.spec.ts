import { HtmlBlock } from '../html-block.block';

describe('HtmlBlock', () => {
  it('should serialize HtmlBlock to JSON correctly', () => {
    const block = new HtmlBlock('<div></div>');
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: HtmlBlock.identifier,
      content: '<div></div>',
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
