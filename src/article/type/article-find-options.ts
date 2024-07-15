export interface ArticleFindOptions {
  readonly page: number;
  readonly limit: number;
  readonly category: string;
  readonly language: string;
  readonly sourceId?: string;
  readonly publishedBefore: Date;
  readonly excludeIds?: string[];
}
