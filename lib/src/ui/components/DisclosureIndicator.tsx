import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';

export const DisclosureIndicator = () => {
  const { colors } = useTheme();

  return <Icon icon={faChevronRight} color={colors.secondaryText} />;
};
