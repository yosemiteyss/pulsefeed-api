import { BlockActionType, NavigateToFeedCategoryAction } from '../block-action.dto';
import { SectionHeaderBlock } from '../section-header-block.dto';

describe('SectionHeaderBlock', () => {
  it('should serialize SectionHeaderBlock to JSON correctly', () => {
    const block = new SectionHeaderBlock('title', new NavigateToFeedCategoryAction('category'));
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: SectionHeaderBlock.identifier,
      title: 'title',
      action: {
        type: NavigateToFeedCategoryAction.identifier,
        actionType: BlockActionType.Navigation,
        categoryKey: 'category',
      },
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
