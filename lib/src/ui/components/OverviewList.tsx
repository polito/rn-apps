import { Children, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { ViewProps } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

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
    emptyStateCaption?: string;
    emptyStateIcon?: IconDefinition;
    emptyStateIconSize?: number;
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
  emptyStateCaption,
  emptyStateIcon,
  emptyStateIconSize,
  style,
  rounded,
  ...rest
}: Props) => {
  const { spacing } = useTheme();
  const { t } = useTranslation();
  const { isEnabled, announce } = useScreenReader();
  return (
    <Card
      rounded={rounded}
      translucent={translucent}
      style={[
        {
          marginBottom: spacing[0],
          marginHorizontal: spacing[4],
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
        emptyStateText && (
          <EmptyState
            message={emptyStateText}
            caption={emptyStateCaption}
            icon={emptyStateIcon}
            iconSize={emptyStateIconSize}
            spacing={8}
          />
        )
      )}
    </Card>
  );
};
