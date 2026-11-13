import { BookingSlot } from '@polito/student-api-client';

import { DateTime } from 'luxon';

export type BookingsStackParamList = {
  Bookings: undefined;
  Booking: { id: number };
  BookingTopic: undefined;
  BookingSlot: { topicId: string; topicName: string };
  BookingSlotsLegend: undefined;
  BookingSeatSelection: {
    slotId: string;
    topicId: string;
    startHour: string;
    endHour: string;
    day: string;
    hasSeatSelection: boolean | undefined;
  };
  BookingSeat: {
    bookingId: number;
    topicId: string;
    slotId: string;
    seatId: number;
  };
};

export type BookingCalendarEvent = BookingSlot & {
  start: DateTime;
  end: DateTime;
  duration: number;
  title: string;
};
