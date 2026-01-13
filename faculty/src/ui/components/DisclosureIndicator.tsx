import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { Icon } from '../../ui/components/Icon';
import { useTheme } from '../../ui/hooks/useTheme';

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
