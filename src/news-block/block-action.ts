import { SlideshowBlock } from './slideshow.block';

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
  protected constructor(type: string, actionType: BlockActionType) {
    this.type = type;
    this.actionType = actionType;
  }

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
  constructor(articleId: string, articleUrl: string) {
    super(NavigateToArticleAction.identifier, BlockActionType.Navigation);
    this.articleId = articleId;
    this.articleUrl = articleUrl;
  }

  /**
   * The type key used to identify the type of this action.
   */
  static readonly identifier = '__navigate_to_article__';

  /**
   * The id of the video article to navigate to.
   */
  readonly articleId: string;

  /**
   * The url of the video article to navigate to.
   */
  readonly articleUrl: string;
}

/**
 * A block action which represents navigation to the video article.
 */
export class NavigateToVideoArticleAction extends BlockAction {
  constructor(articleId: string) {
    super(NavigateToVideoArticleAction.identifier, BlockActionType.Navigation);
    this.articleId = articleId;
  }

  /**
   * The type key used to identify the type of this action.
   */
  static readonly identifier = '__navigate_to_video_article__';

  /**
   * The id of the video article to navigate to.
   */
  readonly articleId: string;
}

/**
 * A block action which represents navigation to the feed.
 */
export class NavigateToFeedCategoryAction extends BlockAction {
  constructor(categoryKey: string) {
    super(NavigateToFeedCategoryAction.identifier, BlockActionType.Navigation);
    this.categoryKey = categoryKey;
  }

  /**
   * The type key used to identify the type of this action.
   */
  static readonly identifier = '__navigate_to_feed_category__';

  /**
   * The category of feed to navigate to.
   */
  readonly categoryKey: string;
}

/**
 * A block action which represents navigation to the slideshow.
 */
export class NavigateToSlideshowAction extends BlockAction {
  constructor(articleId: string, slideshow: SlideshowBlock) {
    super(NavigateToSlideshowAction.identifier, BlockActionType.Navigation);
    this.articleId = articleId;
    this.slideshow = slideshow;
  }

  /**
   * The type key used to identify the type of this action.
   */
  static readonly identifier = '__navigate_to_slideshow__';

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
  constructor() {
    super(UnknownBlockAction.identifier, BlockActionType.Unknown);
  }

  /**
   * The type key used to identify the type of this action.
   */
  static readonly identifier = '__unknown__';
}
