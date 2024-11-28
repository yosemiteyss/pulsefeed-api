import { CategoryDto } from '../category/dto/category.dto';
import { SourceDto } from '../source/dto/source.dto';
import { NewsBlock } from './news-block';

/**
 * A block which represents an article introduction.
 */
export class ArticleIntroductionBlock extends NewsBlock {
  /**
   * The article introduction block type identifier.
   */
  static readonly identifier: string = '__article_introduction__';

  override readonly type: string = ArticleIntroductionBlock.identifier;

  /**
   * The title of the associated article.
   */
  readonly title: string;

  /**
   * The image URL of the associated article.
   */
  readonly imageUrl: string;

  /**
   * The category of the associated article.
   */
  readonly category: CategoryDto;

  /**
   * The source of the associated article.
   */
  readonly sourceDto: SourceDto;

  /**
   * The date when the associated article was published.
   */
  readonly publishedAt: Date;

  /**
   * Whether the associated article requires a premium subscription to access.
   */
  readonly isPremium: boolean = false;
}
