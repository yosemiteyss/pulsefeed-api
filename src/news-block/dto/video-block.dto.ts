import { NewsBlock } from './news-block.dto';

/**
 * A block which represents a video.
 */
export class VideoBlock extends NewsBlock {
  constructor(videoUrl: string) {
    super(VideoBlock.identifier);
    this.videoUrl = videoUrl;
  }

  /**
   * The url of this video.
   */
  readonly videoUrl: string;

  /**
   * The video block type identifier.
   */
  static readonly identifier = '__video__';
}
