import {
  APP_TIMEZONE,
  dateFormatter,
  formatMachineDate,
} from '@polito/lib/core';

import { DateTime } from 'luxon';

export const toApiTime = dateFormatter('HH:mm:ss');
export const toApiDate = formatMachineDate;

const parseApiDateTime = (isoDateTime: string) =>
  DateTime.fromISO(isoDateTime, { zone: APP_TIMEZONE });

export const fromApiTime = (isoDateTime: string) => {
  const parsed = parseApiDateTime(isoDateTime);
  return parsed.isValid ? parsed.toJSDate() : new Date();
};

export const fromApiDate = fromApiTime;
