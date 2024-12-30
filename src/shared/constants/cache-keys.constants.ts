// import { HALF_HOUR_IN_MS, ONE_DAY_IN_MS } from '@pulsefeed/common';
// import { ArticleFilter } from '../../article';
// import { toCacheKeyPart } from '../utils';
//
// /**
//  * Cache keys for api responses.
//  */
// export const ApiResponseCacheKey = {
//   LANGUAGE_LIST: {
//     prefix: 'pf:api:response:language:list',
//     ttl: ONE_DAY_IN_MS,
//     generate: () => 'pf:api:response:language:list',
//   },
//   SOURCE_LIST: {
//     prefix: 'pf:api:response:source:list',
//     ttl: ONE_DAY_IN_MS,
//     generate: (page: number, limit: number) =>
//       `pf:api:response:source:list:${toCacheKeyPart({ page, limit })}`,
//   },
//   CATEGORY_LIST: {
//     prefix: 'pf:api:response:category:list',
//     ttl: ONE_DAY_IN_MS,
//     generate: (languageKey: string) =>
//       `pf:api:response:category:list:${toCacheKeyPart({ languageKey })}`,
//   },
//   ARTICLE_LATEST_FEED: {
//     prefix: 'pf:api:response:article:latest-feed',
//     ttl: HALF_HOUR_IN_MS,
//     generate: (languageKey: string, feedSection?: string) =>
//       `pf:api:response:article:latest-feed:${toCacheKeyPart({ languageKey, feedSection })}`,
//   },
//   ARTICLE_CATEGORY_FEED: {
//     prefix: 'pf:api:response:article:category-feed',
//     ttl: HALF_HOUR_IN_MS,
//     generate: (filter: ArticleFilter) =>
//       `pf:api:response:article:category-feed:${toCacheKeyPart(filter)}`,
//   },
//   ARTICLE_SEARCH: {
//     prefix: 'pf:api:response:article:search',
//     ttl: ONE_DAY_IN_MS,
//     generate: (filter: ArticleFilter) => `pf:api:response:article:search:${toCacheKeyPart(filter)}`,
//   },
// };
