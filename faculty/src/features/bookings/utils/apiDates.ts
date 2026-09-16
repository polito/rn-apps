import { APP_TIMEZONE, dateFormatter } from '@polito/lib/core';

import { DateTime } from 'luxon';

export const toApiTime = dateFormatter('HH:mm:ss');

const parseApiDateTime = (isoDateTime: string) =>
  DateTime.fromISO(isoDateTime, { zone: APP_TIMEZONE });

export const fromApiTime = (isoDateTime: string) => {
  const parsed = parseApiDateTime(isoDateTime);
  return parsed.isValid ? parsed.toJSDate() : new Date();
};
