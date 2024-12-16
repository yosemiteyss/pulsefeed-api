import { maskString } from '../string.utils';

describe('string.utils', () => {
  describe('maskString', () => {
    it('should return masked string with number of visible chars', () => {
      const input = 'abcdefg';
      const masked = maskString(input, 3);
      expect(masked).toEqual('abc****');
    });
  });
});
