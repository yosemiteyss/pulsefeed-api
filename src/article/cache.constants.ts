import { ArticleListRequestDto, ArticleSectionRequestDto } from './dto';

export const CACHE_KEY_ARTICLE = 'pf:article';
export const CACHE_KEY_ARTICLE_LIST = `${CACHE_KEY_ARTICLE}:list`;
export const CACHE_KEY_ARTICLE_FEED = `${CACHE_KEY_ARTICLE}:feed`;

export function cacheKeyArticleList(request: ArticleListRequestDto, publishedBefore: Date) {
  return `${CACHE_KEY_ARTICLE_LIST}:request:${JSON.stringify(request)}:publishedBefore:${publishedBefore}`;
}

export function cacheKeyArticleFeed(request: ArticleSectionRequestDto, publishedBefore: Date) {
  return `${CACHE_KEY_ARTICLE_FEED}:request:${JSON.stringify(request)}:publishedBefore:${publishedBefore}`;
}
