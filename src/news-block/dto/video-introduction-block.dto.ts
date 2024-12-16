import { CategoryResponse } from '../../category';
import { NewsBlock } from './news-block.dto';

/**
 * A block which represents a video introduction.
 */
export class VideoIntroductionBlock extends NewsBlock {
  constructor(category: CategoryResponse, title: string, videoUrl: string) {
    super(VideoIntroductionBlock.identifier);
    this.category = category;
    this.title = title;
    this.videoUrl = videoUrl;
  }

  /**
   * The category of the associated article.
   */
  readonly category: CategoryResponse;

  /**
   * The title of the associated article.
   */
  readonly title: string;

  /**
   * The video url of the associated article.
   */
  readonly videoUrl: string;

  /**
   * The video introduction block type identifier.
   */
  static readonly identifier = '__video_introduction__';
}
