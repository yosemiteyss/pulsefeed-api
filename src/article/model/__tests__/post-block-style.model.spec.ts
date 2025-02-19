import { isPostBlockStyle, PostBlockStyle } from '../post-block-style.model';

describe('PostBlockStyle', () => {
  describe('PostBlockStyle', () => {
    it('should return true for PostBlockStyle.Small', () => {
      expect(isPostBlockStyle(PostBlockStyle.Small)).toBe(true);
    });

    it('should return true for PostBlockStyle.Medium', () => {
      expect(isPostBlockStyle(PostBlockStyle.Medium)).toBe(true);
    });

    it('should return true for PostBlockStyle.Large', () => {
      expect(isPostBlockStyle(PostBlockStyle.Large)).toBe(true);
    });
  });
});
