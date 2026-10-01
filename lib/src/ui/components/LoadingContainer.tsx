import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ViewProps } from 'react-native';

import { hideFromScreenReader } from '../../core/accessibility/hideFromScreenReader';
import { useAnnounceLoading } from '../../core/hooks/useAnnounceLoading';
import { useTheme } from '../hooks/useTheme';
import { ActivityIndicator } from './ActivityIndicator';

type Props = PropsWithChildren<
  {
    loading: boolean;
  } & ViewProps
>;

export const LoadingContainer = ({
  children,
  loading,
  accessibilityLabel,
  ...rest
}: Props) => {
  const { spacing } = useTheme();
  const { t } = useTranslation();

  useAnnounceLoading(loading);

  return (
    <View
      accessible={loading || undefined}
      accessibilityLabel={
        loading ? (accessibilityLabel ?? t('common.loading')) : undefined
      }
      accessibilityState={{ busy: loading }}
      {...rest}
    >
      {loading ? (
        <View {...hideFromScreenReader}>
          <ActivityIndicator
            style={{
              marginVertical: spacing[8],
            }}
          />
        </View>
      ) : (
        children
      )}
    </View>
  );
};
