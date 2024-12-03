/**
 * Intermediate model used for mapping between category entity and dto.
 */
export interface CategoryItem {
  readonly key: string;
  readonly title: string;
  readonly priority: number;
}
