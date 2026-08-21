import { Children, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View, ViewProps } from 'react-native';

import { hideFromScreenReader } from '../../core/accessibility/hideFromScreenReader';
import { useAnnounceLoading } from '../../core/hooks/useAnnounceLoading';
import { useTheme } from '../hooks/useTheme';
import { ActivityIndicator } from './ActivityIndicator';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import { List } from './List';

type Props = PropsWithChildren<
  ViewProps & {
    style?: ViewProps['style'];
    dividers?: boolean;
    loading?: boolean;
    indented?: boolean;
    emptyStateText?: string;
    rounded?: boolean;
    translucent?: boolean;
  }
>;

/**
 * Displays a list of items with automatic dividers inside a card.
 * (Only suitable for short non virtual-scrolled lists)
 */
export const OverviewList = ({
  children,
  loading = false,
  indented = false,
  dividers,
  translucent = false,
  emptyStateText,
  style,
  rounded,
  accessible,
  accessibilityLabel,
  accessibilityState,
  ...rest
}: Props) => {
  const { spacing } = useTheme();
  const { t } = useTranslation();

  const listAccessible =
    accessible === false
      ? false
      : loading
        ? Platform.select({ android: true, ios: false })
        : accessible;

  useAnnounceLoading(loading);

  return (
    <Card
      rounded={rounded}
      translucent={translucent}
      accessible={listAccessible}
      accessibilityLabel={
        loading
          ? (accessibilityLabel ?? t('common.loading'))
          : (accessibilityLabel ?? '')
      }
      accessibilityState={{
        busy: loading,
        ...accessibilityState,
      }}
      style={[
        {
          marginBottom: spacing[0],
          marginHorizontal: spacing[4],
        },
        style,
      ]}
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
      ) : Children.count(children) > 0 ? (
        <List dividers={dividers} indented={indented}>
          {children}
        </List>
      ) : (
        emptyStateText && <EmptyState message={emptyStateText} />
      )}
    </Card>
  );
};
