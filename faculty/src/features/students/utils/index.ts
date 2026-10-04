import { APP_TIMEZONE } from '@polito/lib/core';

import { DateTime } from 'luxon';

/** September, when the academic year starts. Luxon months are 1-based. */
const ACADEMIC_YEAR_START_MONTH = 9;

export const getCurrentAcademicYear = (now: Date = new Date()): string => {
  const zoned = DateTime.fromJSDate(now, { zone: APP_TIMEZONE });
  const startYear =
    zoned.month >= ACADEMIC_YEAR_START_MONTH ? zoned.year : zoned.year - 1;
  return String(startYear);
};
