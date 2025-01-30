import moment from 'moment/moment';

/**
 * Returns the last quarter-hour of the input date.
 * @param inp the input date.
 */
export function getLastQuarterHour(inp?: moment.MomentInput): Date {
  return moment
    .utc(inp)
    .startOf('hour')
    .add(Math.floor(moment.utc(inp).minute() / 15) * 15, 'minutes')
    .toDate();
}

/**
 * Subtract number of years from the input date.
 * @param years the number of years to subtract.
 * @param inp the input date.
 */
export function getYearsAgo(years: number, inp?: moment.MomentInput): Date {
  return moment.utc(inp).subtract(years, 'year').startOf('day').toDate();
}
