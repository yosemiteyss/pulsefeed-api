import { BlockActionType, NavigateToFeedCategoryAction } from '../block-action';
import { SlideshowIntroductionBlock } from '../slideshow-introduction.block';

describe('SlideshowIntroductionBlock', () => {
  it('should serialize SlideshowIntroductionBlock to JSON correctly', () => {
    const block = new SlideshowIntroductionBlock(
      'title',
      'coverImageUrl',
      new NavigateToFeedCategoryAction('category'),
    );
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: SlideshowIntroductionBlock.identifier,
      title: 'title',
      coverImageUrl: 'coverImageUrl',
      action: {
        type: NavigateToFeedCategoryAction.identifier,
        actionType: BlockActionType.Navigation,
        categoryKey: 'category',
      },
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
