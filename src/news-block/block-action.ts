/**
 * The different types of actions.
 */
export enum BlockActionType {
  /**
   *  A navigation action represents an internal navigation to the provided uri.
   */
  Navigation,

  /**
   * An unknown action type.
   */
  Unknown,
}

/**
 * A class which represents an action that can occur when interacting with a block.
 */
export abstract class BlockAction {
  /**
   * The type key used to identify the type of this action.
   */
  readonly type: string;

  /**
   * The type of this action.
   */
  readonly actionType: BlockActionType;
}

/**
 * A block action which represents navigation to the article.
 */
export class NavigateToArticleAction extends BlockAction {
  /**
   * The type key used to identify the type of this action.
   */
  static readonly identifier: string = '__navigate_to_article__';

  /**
   * The id of the video article to navigate to.
   */
  readonly articleId: string;
}

/**
 * A block action which represents navigation to the video article.
 */
export class NavigateToVideoArticleAction extends BlockAction {
  /**
   * The type key used to identify the type of this action.
   */
  static readonly identifier: string = '__navigate_to_video_article__';

  /**
   * The id of the video article to navigate to.
   */
  readonly articleId: string;
}

/**
 * A block action which represents navigation to the feed.
 */
export class NavigateToFeedCategoryAction extends BlockAction {
  /**
   * The type key used to identify the type of this action.
   */
  static readonly identifier: string = '__navigate_to_feed_category__';

  readonly categoryKey: string;
}

/**
 * A block action which represents navigation to the slideshow.
 */
export class NavigateToSlideshowAction extends BlockAction {
  /**
   * The type key used to identify the type of this action.
   */
  static readonly identifier: string = '__navigate_to_slideshow__';

  /**
   * The id of the associated article.
   */
  readonly articleId: string;

  /**
   * The slideshow content.
   */
  readonly slideshow: SlideshowBlock;
}

/**
 * A block action which represents an unknown type.
 */
export class UnknownBlockAction extends BlockAction {
  /**
   * The type key used to identify the type of this action.
   */
  static readonly identifier: string = '__unknown__';
}
