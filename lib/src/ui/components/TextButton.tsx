import { PropsWithChildren } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';

export const TextButton = ({
  children,
  style,
  color,
  ...rest
}: PropsWithChildren<TouchableOpacityProps> & { color?: string }) => {
  const { palettes, spacing, fontWeights, fontSizes } = useTheme();
  return (
    <TouchableOpacity
      style={[
        {
          padding: spacing[2],
          marginRight: -spacing[2],
        },
        style,
      ]}
      {...rest}
    >
      <Text
        style={{
          color: color ?? palettes.primary[400],
          fontWeight: fontWeights.semibold,
          fontSize: fontSizes.md,
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};
