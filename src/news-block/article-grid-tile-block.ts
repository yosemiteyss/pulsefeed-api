import { ArticleBlock } from './article-block';

/**
 * A block which represents an article grid tile block.
 *
 * Multiple {@link ArticleGridTileBlock} blocks form a {@link ArticleGridGroupBlock}.
 */
export class ArticleGridTileBlock extends ArticleBlock {
  /**
   * The article grid tile block type identifier.
   */
  static override readonly identifier = '__article_grid_tile__';

  override readonly type = ArticleGridTileBlock.identifier;
}
