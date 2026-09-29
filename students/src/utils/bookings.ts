import { APP_TIMEZONE } from '@polito/lib/core';
import {
  Theme,
  faSeat,
  faSeatCheck,
  faSeatClock,
  faSeatFull,
  faSeatOutline,
} from '@polito/lib/ui';
import { Booking, BookingTopic } from '@polito/student-api-client';

import { inRange } from 'lodash';
import { DateTime } from 'luxon';

import { BookingCalendarEvent } from '../features/bookings/screens/BookingSlotScreen';

export const MIN_CELL_HEIGHT = 20;

export const DARK_SLOT_BACKGROUNDS = {
  available: '#00538C',
  booked: '#125938',
  full: '#7F173C',
  notYetBookable: '#7B321D',
};

export const isSlotBookable = (item: BookingCalendarEvent) => {
  const bookingStartsAt = DateTime.fromJSDate(item.bookingStartsAt as Date, {
    zone: APP_TIMEZONE,
  }).valueOf();
  const bookingEndsAt = DateTime.fromJSDate(item.bookingEndsAt as Date, {
    zone: APP_TIMEZONE,
  }).valueOf();
  return (
    item.canBeBooked &&
    inRange(
      DateTime.now().setZone(APP_TIMEZONE).valueOf(),
      bookingStartsAt,
      bookingEndsAt,
    )
  );
};

export const isSlotFull = (item: BookingCalendarEvent) => {
  return item.bookedPlaces >= item.places;
};

export const isPastSlot = (item: BookingCalendarEvent) => {
  return DateTime.now().setZone(APP_TIMEZONE) > item.end;
};

export const canBeBookedWithSeatSelection = (slot: BookingCalendarEvent) => {
  return (
    slot.canBeBooked &&
    slot.hasSeatSelection &&
    slot.hasSeats &&
    slot.end > DateTime.now().setZone(APP_TIMEZONE)
  );
};

export const getBookingStyle = (
  item: BookingCalendarEvent,
  palettes: Theme['palettes'],
  colors: Theme['colors'],
  dark: boolean,
) => {
  const isBooked = item.isBooked;
  const isFull = isSlotFull(item);
  const canBeBooked = isSlotBookable(item);
  const notYetBookable = item.start > DateTime.now().setZone(APP_TIMEZONE);
  const isPast = isPastSlot(item);

  if (isBooked && !isPast) {
    return {
      backgroundColor: dark
        ? DARK_SLOT_BACKGROUNDS.booked
        : palettes.tertiary['100'],
      color: palettes.tertiary[dark ? '200' : '700'],
    };
  }
  if (canBeBooked) {
    return {
      backgroundColor: dark
        ? DARK_SLOT_BACKGROUNDS.available
        : palettes.navy[50],
      color: palettes.navy[dark ? '50' : '600'],
    };
  }
  if (isPast) {
    return {
      backgroundColor: colors.background,
      color: palettes.gray[400],
    };
  }
  if (isFull) {
    return {
      backgroundColor: dark ? DARK_SLOT_BACKGROUNDS.full : palettes.rose['200'],
      color: palettes.rose[dark ? '200' : '800'],
    };
  }
  if (notYetBookable) {
    return {
      backgroundColor: dark
        ? DARK_SLOT_BACKGROUNDS.notYetBookable
        : palettes.secondary['100'],
      color: palettes.secondary[dark ? '200' : '800'],
    };
  }
  return {
    backgroundColor: colors.background,
    color: palettes.gray[400],
  };
};

export const getBookingSlotIcon = (item: BookingCalendarEvent) => {
  const isPast = isPastSlot(item);
  if (item.isBooked && !isPast) {
    return faSeatCheck;
  }
  if (isSlotBookable(item)) {
    return faSeat;
  }
  if (isPast) {
    return faSeatOutline;
  }
  if (isSlotFull(item)) {
    return faSeatFull;
  }
  if (item.start > DateTime.now().setZone(APP_TIMEZONE)) {
    return faSeatClock;
  }
  return faSeatFull;
};

export const getBookingSlotStatus = (
  item: BookingCalendarEvent,
  defaultMessage = 'bookingScreen.bookingStatus.notAvailable',
) => {
  const isBooked = item.isBooked;
  const isFull = item.bookedPlaces === item.places;
  const canBeBooked = item.canBeBooked;
  if (isBooked) {
    return 'bookingScreen.bookingStatus.booked';
  }
  if (isFull) {
    return 'bookingScreen.bookingStatus.full';
  }
  if (canBeBooked) {
    return 'bookingScreen.bookingStatus.available';
  }
  return defaultMessage;
};

export const canBeCancelled = (booking?: Booking) => {
  return (
    !!booking?.cancelableUntil &&
    booking?.cancelableUntil.getTime() > Date.now()
  );
};

export const getCalendarHours = (startHour = 8, endHour = 20) => {
  return Array.from({ length: endHour - startHour }, (_, i) => i + startHour);
};

export const getCalendarPropsFromTopic = (
  topics?: BookingTopic[],
  topicId?: string,
) => {
  const topicIndex = topics?.findIndex(topic => topic.id === topicId);
  if (topicIndex !== undefined && topicIndex > -1 && topics) {
    return topics[topicIndex];
  }
  const topicWithSubtopics = topics?.find(topic =>
    topic.subtopics?.find(subtopic => subtopic.id === topicId),
  );
  const topic = topicWithSubtopics?.subtopics?.find(
    subtopic => subtopic.id === topicId,
  );
  return {
    ...topic,
  };
};
