import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useScreenReader } from '../../core/hooks/useScreenReader';
import { useTheme } from '../hooks/useTheme';
import { ActivityIndicator } from './ActivityIndicator';

type Props = PropsWithChildren<{
  loading: boolean;
}>;
export const LoadingContainer = ({ children, loading, ...rest }: Props) => {
  const { spacing } = useTheme();
  const { t } = useTranslation();
  const { isEnabled, announce } = useScreenReader();

  return (
    <View
      accessible={false}
      onAccessibilityTap={() => {
        if (loading && isEnabled) {
          announce(t('common.loading'));
        }
      }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          style={{
            marginVertical: spacing[8],
          }}
        />
      ) : (
        children
      )}
    </View>
  );
};
