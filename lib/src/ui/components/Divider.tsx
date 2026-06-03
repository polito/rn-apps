import { StyleSheet, View, ViewProps } from 'react-native';

import { useTheme } from '../hooks/useTheme';

export interface DividerProps extends ViewProps {
  size?: number;
  /**
   * Full-width (in the parent) horizontal hairline; `size` is line thickness only.
   * Default is square min bounds for legacy vertical / square dividers.
   */
  horizontal?: boolean;
}

/**
 * A divider element to separate list items
 */
export const Divider = ({
  size = StyleSheet.hairlineWidth,
  horizontal = false,
  style,
  ...props
}: DividerProps) => {
  const { colors } = useTheme();
  return (
    <View
      {...props}
      style={[
        horizontal
          ? {
              alignSelf: 'stretch',
              minHeight: size,
              backgroundColor: colors.divider,
            }
          : {
              minWidth: size,
              minHeight: size,
              backgroundColor: colors.divider,
            },
        style,
      ]}
    />
  );
};
