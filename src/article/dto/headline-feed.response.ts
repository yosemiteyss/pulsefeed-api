import { PageResponse } from '@pulsefeed/common';

export class HeadlineFeedResponse<T> extends PageResponse<T> {
  constructor(data: T[], total: number, page: number, limit: number, feedSection?: string) {
    super(data, total, page, limit);
    this.feedSection = feedSection;
  }

  /**
   * The identifier of the next feed section.
   */
  readonly feedSection?: string;
}
