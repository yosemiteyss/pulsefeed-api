export enum PostBlockStyle {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export function isPostBlockStyle(value: string): value is PostBlockStyle {
  return Object.values(PostBlockStyle).includes(value as PostBlockStyle);
}
