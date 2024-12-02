import { SpacerBlock, Spacing } from '../spacer-block.dto';

describe('SpacerBlock', () => {
  it('should serialize SpacerBlock to JSON correctly', () => {
    const block = new SpacerBlock(Spacing.ExtraSmall);
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: SpacerBlock.identifier,
      spacing: Spacing.ExtraSmall,
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
