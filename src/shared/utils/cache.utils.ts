export function toCacheKeyPart(params: object, includeStartSeparator: boolean = true): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value) && value.length <= 0) continue;

    if (value instanceof Date) {
      parts.push(`${key}:${value.toISOString()}`);
      continue;
    }

    if (Array.isArray(value)) {
      parts.push(`${key}:${value.join(',')}`);
      continue;
    }

    parts.push(`${key}:${value}`);
  }

  const partString = parts.join(':');
  return includeStartSeparator ? `:${partString}` : partString;
}
