/**
 * Cache keys for api responses.
 */
export const ResponseCacheKeys = {
  LANGUAGE_LIST: 'pf:api:response:language:list',
  SOURCE_LIST: 'pf:api:response:source:list',
  SOURCE_PAGE: 'pf:api:response:source:list:page:{page}:limit:{limit}',
  CATEGORY_LIST: 'pf:api:response:category:list',
  CATEGORY_LIST_BY_LANG: 'pf:api:response:category:list:languageKey:{languageKey}',
  ARTICLE_FEED_LATEST: `pf:api:article-feed-latest:categoryKey:{categoryKey}`,
  ARTICLE_FEED_CATEGORY: 'pf:api:article-feed-category:filter:{filter}',
};
