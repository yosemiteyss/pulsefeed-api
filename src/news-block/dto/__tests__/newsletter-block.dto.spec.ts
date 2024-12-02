import { NewsletterBlock } from '../newsletter-block.dto';

describe('NewsletterBlock', () => {
  it('should serialize NewsletterBlock to JSON correctly', () => {
    const block = new NewsletterBlock();
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: NewsletterBlock.identifier,
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
