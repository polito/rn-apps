import { PropsWithChildren } from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';

export const TextButton = ({
  children,
  style,
  textStyle,
  ...rest
}: PropsWithChildren<
  TouchableOpacityProps & { textStyle?: StyleProp<TextStyle> }
>) => {
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
        style={[
          {
            color: palettes.primary[400],
            fontWeight: fontWeights.semibold,
            fontSize: fontSizes.md,
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};
