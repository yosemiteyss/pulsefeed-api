import { ArticleGridTileBlock } from './article-grid-tile-block';
import { CategoryDto } from '../category/dto/category.dto';
import { NewsBlock } from './news-block';

/**
 * A block which represents a post grid group.
 */
export class ArticleGridGroupBlock extends NewsBlock {
  /**
   * The article grid block type identifier.
   */
  static readonly identifier: string = '__article_grid_group__';

  override readonly type: string = ArticleGridGroupBlock.identifier;

  /**
   * The category of this article grid group.
   */
  readonly category: CategoryDto;

  /**
   * The associated list of {@link ArticleGridTileBlock} tiles.
   */
  readonly tiles: ArticleGridTileBlock[];
}
