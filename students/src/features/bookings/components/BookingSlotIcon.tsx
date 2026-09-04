import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Icon, faSeat } from '@polito/lib/ui';

type Props = {
  icon: IconDefinition;
  color: string;
  size: number;
};

const VIEW_BOX_EXPANSION = 64;

export const BookingSlotIcon = ({ icon, color, size }: Props) => {
  const [width, height] = icon.icon;
  const seatWidth = icon === faSeat ? width : height;
  const renderedWidth = Math.max(width, height + VIEW_BOX_EXPANSION);

  return (
    <Icon icon={icon} color={color} size={(size * renderedWidth) / seatWidth} />
  );
};
