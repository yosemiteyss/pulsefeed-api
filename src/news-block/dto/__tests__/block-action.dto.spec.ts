import {
  BlockActionType,
  NavigateToArticleAction,
  NavigateToFeedCategoryAction,
  NavigateToSlideshowAction,
  NavigateToVideoArticleAction,
  UnknownBlockAction,
} from '../block-action.dto';
import { SlideshowBlock } from '../slideshow-block.dto';
import { SlideBlock } from '../slide-block.dto';

describe('BlockAction', () => {
  it('should serialize NavigateToArticleAction to JSON correctly', () => {
    const block = new NavigateToArticleAction('articleId', 'articleUrl');
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: NavigateToArticleAction.identifier,
      actionType: BlockActionType.Navigation,
      articleId: 'articleId',
      articleUrl: 'articleUrl',
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });

  it('should serialize NavigateToVideoArticleAction to JSON correctly', () => {
    const block = new NavigateToVideoArticleAction('articleId');
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: NavigateToVideoArticleAction.identifier,
      actionType: BlockActionType.Navigation,
      articleId: 'articleId',
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });

  it('should serialize NavigateToFeedCategoryAction to JSON correctly', () => {
    const block = new NavigateToFeedCategoryAction('categoryKey');
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: NavigateToFeedCategoryAction.identifier,
      actionType: BlockActionType.Navigation,
      categoryKey: 'categoryKey',
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });

  it('should serialize NavigateToSlideshowAction to JSON correctly', () => {
    const block = new NavigateToSlideshowAction(
      'articleId',
      new SlideshowBlock('title', [
        new SlideBlock('caption', 'description', 'photoCredit', 'imageUrl'),
      ]),
    );
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: NavigateToSlideshowAction.identifier,
      actionType: BlockActionType.Navigation,
      articleId: 'articleId',
      slideshow: {
        type: SlideshowBlock.identifier,
        title: 'title',
        slides: [
          {
            type: SlideBlock.identifier,
            caption: 'caption',
            description: 'description',
            photoCredit: 'photoCredit',
            imageUrl: 'imageUrl',
          },
        ],
      },
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });

  it('should serialize UnknownBlockAction to JSON correctly', () => {
    const block = new UnknownBlockAction();
    const jsonString = JSON.stringify(block);

    const expectedJson = {
      type: UnknownBlockAction.identifier,
      actionType: BlockActionType.Unknown,
    };

    expect(JSON.parse(jsonString)).toEqual(expectedJson);
  });
});
