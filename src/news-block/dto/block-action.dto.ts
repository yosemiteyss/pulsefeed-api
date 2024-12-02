import { SlideshowBlock } from './slideshow-block.dto';

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
  constructor(actionType: BlockActionType, articleId: string) {
    super(NavigateToArticleAction.identifier, actionType);
    this.articleId = articleId;
  }

  /**
   * The type key used to identify the type of this action.
   */
  static readonly identifier = '__navigate_to_article__';

  /**
   * The id of the video article to navigate to.
   */
  readonly articleId: string;
}

/**
 * A block action which represents navigation to the video article.
 */
export class NavigateToVideoArticleAction extends BlockAction {
  constructor(actionType: BlockActionType, articleId: string) {
    super(NavigateToVideoArticleAction.identifier, actionType);
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
  constructor(actionType: BlockActionType, categoryKey: string) {
    super(NavigateToFeedCategoryAction.identifier, actionType);
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
  constructor(actionType: BlockActionType, articleId: string, slideshow: SlideshowBlock) {
    super(NavigateToSlideshowAction.identifier, actionType);
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
