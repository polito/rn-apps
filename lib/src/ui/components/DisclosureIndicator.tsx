import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';

export type DisclosureIndicatorProps = {
  size?: number;
};

export const DisclosureIndicator = ({ size }: DisclosureIndicatorProps) => {
  const { colors } = useTheme();

  return (
    <Icon
      icon={faChevronRight}
      color={colors.secondaryText}
      {...(size !== undefined ? { size } : {})}
    />
  );
};
