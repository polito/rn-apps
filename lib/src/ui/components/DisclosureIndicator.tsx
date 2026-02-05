import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';

export const DisclosureIndicator = () => {
  const { colors, spacing } = useTheme();

  return (
    <Icon
      icon={faChevronRight}
      color={colors.secondaryText}
      style={{
        marginLeft: spacing[1],
        marginRight: -spacing[1],
      }}
    />
  );
};
