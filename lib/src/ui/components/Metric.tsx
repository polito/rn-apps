import { ReactElement } from 'react';
import { View, ViewProps } from 'react-native';

import { useTheme } from '../hooks/useTheme';
import { CardProps } from './Card';
import { Text, TextProps } from './Text';

type Props = ViewProps & {
  title?: string;
  value: string | number | ReactElement;
  color?: string;
  valueStyle?: TextProps['style'];
  valueNumberOfLines?: number;
};

/**
 * A view used to present a simple textual metric
 */
export const Metric = ({
  title,
  value,
  color,
  valueStyle,
  valueNumberOfLines,
  ...rest
}: CardProps & Props) => {
  const { dark, palettes, fontSizes, fontWeights } = useTheme();

  return (
    <View {...rest}>
      {title && <Text accessible={false}>{title}</Text>}
      {['string', 'number'].includes(typeof value) ? (
        <Text
          accessible={false}
          numberOfLines={valueNumberOfLines}
          ellipsizeMode={valueNumberOfLines != null ? 'tail' : undefined}
          style={[
            {
              color: color ?? palettes.secondary[dark ? 500 : 600],
              fontSize: fontSizes.lg,
              fontWeight: fontWeights.semibold,
            },
            valueStyle,
          ]}
        >
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );
};
