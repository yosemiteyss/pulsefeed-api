/**
 * Return string with masked format.
 * @param input string input.
 * @param visible the number of leading visible character.
 * @param maskChar the mask character.
 */
export function maskString(input: string, visible: number = 4, maskChar: string = '*'): string {
  const visibleCount = Math.max(0, Math.min(visible, input.length));
  const visiblePart = input.slice(0, visibleCount);
  const maskedPart = maskChar.repeat(input.length - visibleCount);
  return visiblePart + maskedPart;
}
