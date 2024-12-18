import { getLastYearDate } from '../date.utils';

describe('getLastYearDate', () => {
  it('should return the same day last year with time set to 00:00:00', () => {
    const today = new Date();
    const expectedDate = new Date(today);
    expectedDate.setFullYear(today.getFullYear() - 1);
    expectedDate.setHours(0, 0, 0, 0); // Set expected time to 00:00:00

    const result = getLastYearDate();

    // Compare year, month, day, hours, minutes, seconds, and milliseconds
    expect(result.getFullYear()).toBe(expectedDate.getFullYear());
    expect(result.getMonth()).toBe(expectedDate.getMonth());
    expect(result.getDate()).toBe(expectedDate.getDate());
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });
});
