import { Platform, View, ViewProps } from 'react-native';

import { IS_IOS } from '../../core/components/costant';
import { useTheme } from '../hooks/useTheme';
import React from 'react';

export type CardProps = ViewProps & {
  /**
   * Toggles the rounded corners
   */
  rounded?: boolean;

  /**
   * Toggles the inner spacing
   */
  padded?: boolean;

  /**
   * Toggles the outer spacing
   */
  spaced?: boolean;

  /**
   * Toggles the inner spacing
   */
  gapped?: boolean;

  /**
   * If true, uses a semi-transparent background
   * for use on translucent surfaces
   */
  translucent?: boolean;
};

/**
 * Renders an elevated surface on Android and a
 * flat card on iOS
 */
export const Card = ({
  children,
  style,
  translucent = false,
  spaced = Platform.select({ ios: true, android: false }),
  rounded = Platform.select({ ios: true, android: false }),
  gapped = false,
  padded = false,
  ...rest
}: CardProps) => {
  const { colors, shapes, spacing } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: typeof colors.surface === 'string' ? colors.surface : colors.surface[500],
          elevation: 2,
          marginHorizontal: spaced ? spacing[4]  : undefined,
          marginVertical: spacing[2] ,
          overflow: 'hidden',
          borderRadius: rounded ? shapes.lg : undefined,
        },
        padded
          ? {
              paddingHorizontal: padded ? spacing[2.5] : undefined,
              paddingVertical: padded ? spacing[2.5] : undefined,
            }
          : {},
        gapped
          ? {
              display: 'flex',
              flexDirection: 'column',
              gap: spacing[2],
            }
          : {},
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};