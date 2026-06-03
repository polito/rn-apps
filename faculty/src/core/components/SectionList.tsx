import { PropsWithChildren } from 'react';
import { ActivityIndicator } from 'react-native';

import { Card, List, useTheme } from '@polito/lib/ui';

type Props = PropsWithChildren<{
  dividers?: boolean;
  loading?: boolean;
  dividerSize?: number;
}>;

/**
 * Displays a list of items with automatic dividers inside a card.
 * (Only suitable for short non virtual-scrolled lists)
 */
export const SectionList = ({
  children,
  loading = false,
  dividers = true,
  dividerSize = 1,
}: Props) => {
  const { spacing } = useTheme();

  return (
    <Card
      rounded
      style={{
        marginVertical: spacing[2],
        marginHorizontal: spacing[4],
      }}
    >
      {loading ? (
        <ActivityIndicator
          style={{
            marginVertical: spacing[8],
          }}
        />
      ) : (
        <List dividers={dividers} dividerSize={dividerSize}>
          {children}
        </List>
      )}
    </Card>
  );
};
