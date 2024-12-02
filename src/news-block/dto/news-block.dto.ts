/**
 * A reusable news block which represents a content-based component.
 */
export abstract class NewsBlock {
  protected constructor(type: string) {
    this.type = type;
  }

  /**
   * The block type key used to identify the type of block/metadata.
   */
  readonly type: string;
}
