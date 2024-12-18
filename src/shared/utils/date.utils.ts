/**
 * Returns the date exactly one year ago from today, with the time set to 00:00:00.
 */
export function getLastYearDate(): Date {
  const today = new Date();
  const lastYearDate = new Date(today);
  lastYearDate.setFullYear(today.getFullYear() - 1);
  lastYearDate.setHours(0, 0, 0, 0);
  return lastYearDate;
}
