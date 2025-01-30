import { getLastQuarterHour, getYearsAgo } from '../date.utils';

describe('DateUtils', () => {
  describe('getLastQuarterHour', () => {
    it('should return the last quarter-hour correctly', () => {
      const result = getLastQuarterHour('2025-01-31T13:37:00Z');
      const expected = new Date('2025-01-31T13:30:00Z');
      expect(result).toEqual(expected);
    });

    it('should return the exact hour when at the start of an hour', () => {
      const result = getLastQuarterHour('2025-01-31T14:00:00Z');
      const expected = new Date('2025-01-31T14:00:00Z');
      expect(result).toEqual(expected);
    });

    it('should return the previous quarter-hour correctly', () => {
      const result = getLastQuarterHour('2025-01-31T14:59:00Z');
      const expected = new Date('2025-01-31T14:45:00Z');
      expect(result).toEqual(expected);
    });
  });

  describe('getYearsAgo', () => {
    it('should return the correct date from years ago', () => {
      const result = getYearsAgo(3, '2025-01-31T13:37:00Z');
      const expected = new Date('2022-01-31T00:00:00.000Z');
      expect(result).toEqual(expected);
    });
  });
});
