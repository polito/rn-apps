import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';

export type DisclosureIndicatorProps = {
  size?: number;
};

export const DisclosureIndicator = ({ size }: DisclosureIndicatorProps) => {
  const { colors, spacing } = useTheme();

  return (
    <Icon
      icon={faChevronRight}
      color={colors.secondaryText}
      {...(size !== undefined ? { size } : {})}
      style={{
        marginLeft: spacing[1],
        marginRight: -spacing[1],
      }}
    />
  );
};
