import { NewsBlock } from './news-block.dto';
import { CategoryDto } from '../../category';
import { SourceDto } from '../../source';

/**
 * A block which represents an article introduction.
 */
export class ArticleIntroductionBlock extends NewsBlock {
  constructor(
    title: string,
    category: CategoryDto,
    source: SourceDto,
    publishedAt: Date,
    imageUrl?: string,
    isPremium: boolean = false,
  ) {
    super(ArticleIntroductionBlock.identifier);
    this.title = title;
    this.category = category;
    this.source = source;
    this.publishedAt = publishedAt;
    this.imageUrl = imageUrl;
    this.isPremium = isPremium;
  }

  /**
   * The article introduction block type identifier.
   */
  static readonly identifier = '__article_introduction__';

  /**
   * The title of the associated article.
   */
  readonly title: string;

  /**
   * The image URL of the associated article.
   */
  readonly imageUrl?: string;

  /**
   * The category of the associated article.
   */
  readonly category: CategoryDto;

  /**
   * The source of the associated article.
   */
  readonly source: SourceDto;

  /**
   * The date when the associated article was published.
   */
  readonly publishedAt: Date;

  /**
   * Whether the associated article requires a premium subscription to access.
   */
  readonly isPremium: boolean = false;
}
