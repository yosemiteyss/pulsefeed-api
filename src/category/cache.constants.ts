export const CACHE_KEY_CATEGORY_LIST = 'pf:category:list';

export function cacheKeyCategoryList(langKey: string): string {
  return `${CACHE_KEY_CATEGORY_LIST}:language:${langKey}`;
}
