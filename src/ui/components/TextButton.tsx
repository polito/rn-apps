import { PropsWithChildren } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { Text } from './Text';
import { useTheme } from '../../ui/hooks/useTheme';
import React from 'react';

export const TextButton = ({
  children,
  style,
  ...rest
}: PropsWithChildren<TouchableOpacityProps>) => {
  const { colors, spacing, fontWeights, fontSizes, palettes } = useTheme();
  return (
    <TouchableOpacity
      style={[
        {
          padding: spacing[2] ,
          marginRight: -spacing[2] ,
        },
        style,
      ]}
      {...rest}
    >
      <Text
        style={{
          color: palettes.primary[400],
          fontWeight: fontWeights.semibold,
          fontSize: fontSizes.md,
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};