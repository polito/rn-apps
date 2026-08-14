import { DateTime } from 'luxon';

import { Slot } from '../types/interdepartmentalSpaces';

export type TimelineEvent = {
  id: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  category: string;
  person: string;
  description: string;
  borderColor: string;
  backgroundColor: string;
  personColor: string;
  isOwn?: boolean;
  isPubliclyVisible?: boolean;
};

const OTHER_EVENT_COLORS = {
  borderColor: '#B94B04',
  backgroundColor: '#FFF2C5',
  personColor: '#B45309',
};

const USER_EVENT_COLORS = {
  borderColor: '#008236',
  backgroundColor: '#DCFCE7',
  personColor: '#008236',
};

const formatPersonName = (bookedBy: Slot['bookedBy']) =>
  `${bookedBy.name} ${bookedBy.surname}`;

export const slotToTimelineEvent = (
  slot: Slot,
  options: {
    currentEmail?: string;
    typeLabels?: Record<string, string>;
  } = {},
): TimelineEvent => {
  const start = DateTime.fromISO(slot.startAt);
  const end = DateTime.fromISO(slot.endAt);
  const isOwn = options.currentEmail
    ? slot.bookedBy.email === options.currentEmail
    : false;
  const category =
    options.typeLabels?.[slot.type]?.toUpperCase() ?? slot.type.toUpperCase();

  return {
    id: slot.id,
    startHour: start.hour,
    startMinute: start.minute,
    endHour: end.hour,
    endMinute: end.minute,
    category,
    person: formatPersonName(slot.bookedBy),
    description: slot.description,
    isOwn,
    isPubliclyVisible: true,
    ...(isOwn ? USER_EVENT_COLORS : OTHER_EVENT_COLORS),
  };
};

export const slotsToTimelineEvents = (
  slots: Slot[],
  selectedDate: DateTime,
  options: {
    currentEmail?: string;
    typeLabels?: Record<string, string>;
  } = {},
): TimelineEvent[] =>
  slots
    .filter(slot => {
      const start = DateTime.fromISO(slot.startAt);
      return start.hasSame(selectedDate, 'day');
    })
    .map(slot => slotToTimelineEvent(slot, options))
    .filter(event => event.isOwn || event.isPubliclyVisible !== false);

export const toApiTime = (date: Date) =>
  DateTime.fromJSDate(date).toFormat('HH:mm:ss');

export const toApiDate = (date: Date) =>
  DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');

export const fromApiTime = (isoDateTime: string) => {
  const parsed = DateTime.fromISO(isoDateTime);
  return parsed.isValid ? parsed.toJSDate() : new Date();
};

export const fromApiDate = (isoDateTime: string) => {
  const parsed = DateTime.fromISO(isoDateTime);
  return parsed.isValid ? parsed.toJSDate() : new Date();
};
