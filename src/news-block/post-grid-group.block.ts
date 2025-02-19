import { PostGridTileBlock } from './post-grid-tile.block';
import { CategoryResponse } from '../category';
import { NewsBlock } from './news.block';

/**
 * A block which represents a post grid group.
 */
export class PostGridGroupBlock extends NewsBlock {
  constructor(category: CategoryResponse, tiles: PostGridTileBlock[]) {
    super(PostGridGroupBlock.identifier);
    this.category = category;
    this.tiles = tiles;
  }

  /**
   * The article grid block type identifier.
   */
  static readonly identifier = '__post_grid_group__';

  /**
   * The category of this article grid group.
   */
  readonly category: CategoryResponse;

  /**
   * The associated list of {@link PostGridTileBlock} tiles.
   */
  readonly tiles: PostGridTileBlock[];
}
