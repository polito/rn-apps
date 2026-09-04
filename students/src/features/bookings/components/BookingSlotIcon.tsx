import { Icon, faSeat } from '@polito/lib/ui';

import { getBookingSlotIcon } from '~/utils/bookings';

import { BookingCalendarEvent } from '../screens/BookingSlotScreen';

type Props = {
  item: BookingCalendarEvent;
  color: string;
  size: number;
};

const VIEW_BOX_EXPANSION = 64;

export const BookingSlotIcon = ({ item, color, size }: Props) => {
  const icon = getBookingSlotIcon(item);
  const [width, height] = icon.icon;
  const seatWidth = icon === faSeat ? width : height;
  const renderedWidth = Math.max(width, height + VIEW_BOX_EXPANSION);

  return (
    <Icon icon={icon} color={color} size={(size * renderedWidth) / seatWidth} />
  );
};
