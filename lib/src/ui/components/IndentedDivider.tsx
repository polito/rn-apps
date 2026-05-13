import { StyleSheet } from 'react-native';

import { Divider, DividerProps } from './Divider';

interface IndentedDividerProps extends DividerProps {
  indent?: number;
}

/**
 * A divider element to separate list items with indentation
 */
export const IndentedDivider = ({
  style,
  indent = 0,
  size = StyleSheet.hairlineWidth,
  ...props
}: IndentedDividerProps) => {
  return (
    <Divider
      horizontal
      {...props}
      size={size}
      style={[{ marginStart: indent }, style]}
    />
  );
};
