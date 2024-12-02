import { UnknownBlock } from '../unknown-block.dto';

describe('UnknownBlock', () => {
  it('should serialize UnknownBlock to JSON correctly', () => {
    const block = new UnknownBlock();
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: UnknownBlock.identifier,
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
