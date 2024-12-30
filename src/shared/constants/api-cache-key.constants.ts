import { HALF_HOUR_IN_MS, ONE_DAY_IN_MS } from '@pulsefeed/common';

/**
 * Cache keys for api responses.
 */
export const ApiResponseCacheKey = {
  LANGUAGE_LIST: {
    prefix: 'pf:api:response:language:list',
    ttl: ONE_DAY_IN_MS,
  },
  SOURCE_LIST: {
    prefix: 'pf:api:response:source:list',
    ttl: ONE_DAY_IN_MS,
  },
  CATEGORY_LIST: {
    prefix: 'pf:api:response:category:list',
    ttl: ONE_DAY_IN_MS,
  },
  ARTICLE_LATEST_FEED: {
    prefix: 'pf:api:response:article:latest-feed',
    ttl: HALF_HOUR_IN_MS,
  },
  ARTICLE_CATEGORY_FEED: {
    prefix: 'pf:api:response:article:category-feed',
    ttl: HALF_HOUR_IN_MS,
  },
  ARTICLE_SEARCH: {
    prefix: 'pf:api:response:article:search',
    ttl: ONE_DAY_IN_MS,
  },
};
