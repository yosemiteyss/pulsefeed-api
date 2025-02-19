import { DividerHorizontalBlock } from '../divider-horizontal.block';

describe('DividerHorizontalBlock', () => {
  it('should serialize DividerHorizontalBlock to JSON correctly', () => {
    const block = new DividerHorizontalBlock();
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: DividerHorizontalBlock.identifier,
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
