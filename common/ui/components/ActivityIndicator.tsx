import {
  ActivityIndicatorProps,
  ActivityIndicator as RNActivityIndicator,
} from 'react-native';

import { IS_ANDROID } from '@lib/core/constants';
import { useTheme } from '@lib/ui/hooks/useTheme';

export const ActivityIndicator = (props: ActivityIndicatorProps) => {
  const { palettes } = useTheme();

  return (
    <RNActivityIndicator
      color={IS_ANDROID ? palettes.secondary[600] : undefined}
      {...props}
    />
  );
};
