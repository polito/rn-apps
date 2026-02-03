import { View, ViewProps } from 'react-native';

import { useTheme } from '@polito/lib';

declare interface TranslucentViewProps {
  style?: ViewProps['style'];
  blurAmount?: number;
  fallbackOpacity?: number;
}

export const TranslucentView = ({
  style = undefined,
  fallbackOpacity = 0.85,
}: TranslucentViewProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          opacity: fallbackOpacity,
        },
        style,
      ]}
    />
  );
};
