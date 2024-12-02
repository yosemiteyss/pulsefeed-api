import { PostGridTileBlock } from './post-grid-tile-block.dto';
import { NewsBlock } from './news-block.dto';
import { CategoryDto } from '../../category';

/**
 * A block which represents a post grid group.
 */
export class PostGridGroupBlock extends NewsBlock {
  constructor(category: CategoryDto, tiles: PostGridTileBlock[]) {
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
  readonly category: CategoryDto;

  /**
   * The associated list of {@link PostGridTileBlock} tiles.
   */
  readonly tiles: PostGridTileBlock[];
}
