import { Children, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ViewProps } from 'react-native';

import { useScreenReader } from '../../../src/core/hooks/useScreenReader';
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
  ...rest
}: Props) => {
  const { spacing } = useTheme();
  const { t } = useTranslation();
  const { isEnabled, announce } = useScreenReader();
  return (
    <Card
      accessible={Platform.select({ android: true, ios: false })}
      rounded={rounded ?? Platform.select({ android: false })}
      translucent={translucent}
      style={[
        {
          marginVertical: spacing[2],
          marginHorizontal: Platform.select({ ios: spacing[4] }),
        },
        style,
      ]}
      {...rest}
      onAccessibilityTap={() => {
        if (loading && isEnabled) {
          announce(t('common.loading'));
        }
      }}
    >
      {loading ? (
        <ActivityIndicator
          style={{
            marginVertical: spacing[8],
          }}
        />
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
