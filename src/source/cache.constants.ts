export const CACHE_KEY_SOURCE_LIST = `pf:source:list`;

export function cacheKeySourceList(page: number, limit: number): string {
  return `${CACHE_KEY_SOURCE_LIST}:page:${page}:limit:${limit}`;
}
