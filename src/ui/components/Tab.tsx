import { PropsWithChildren, useMemo } from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableHighlightProps,
  View,
} from 'react-native';

import color from 'color';

import { useTheme } from '../hooks/useTheme';
import { PillButton } from './PillButton';
import { Text } from './Text';
import { UnreadBadge } from './UnreadBadge';

export interface Props {
  selected?: boolean;
  textStyle?: StyleProp<TextStyle>;
  badge?: number | string;
}

/**
 * A tab component to be used with Tabs
 */
export const Tab = ({
  children,
  style,
  selected = false,
  textStyle,
  badge,
  ...rest
}: PropsWithChildren<TouchableHighlightProps & Props>) => {
  const { dark, palettes, fontWeights } = useTheme();
  const backgroundColor = useMemo(
    () =>
      selected
        ? palettes.primary[500]
        : color(palettes.primary[dark ? 600 : 50])
            .alpha(0.4)
            .toString(),
    [selected, dark, palettes],
  );

  const borderColor = useMemo(
    () => (selected ? 'transparent' : palettes.primary[50]),
    [selected, palettes],
  );

  const borderWidth = useMemo(() => (selected ? 0 : 1), [selected]);

  return (
    <PillButton
      accessibilityRole="tab"
      accessible={true}
      accessibilityState={{
        selected,
      }}
      style={[
        {
          backgroundColor,
          borderColor,
          borderWidth,
        },
        style,
      ]}
      {...rest}
    >
      <View style={{ position: 'relative' }}>
        <Text
          weight="medium"
          style={[
            {
              color: selected
                ? palettes.text[50]
                : dark
                  ? palettes.primary[400]
                  : palettes.primary[500],
              fontWeight: fontWeights.medium,
              fontSize: 13,
              lineHeight: 19.5,
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
        {badge && (
          <UnreadBadge
            text={badge}
            style={{
              position: 'absolute',
              right: -15,
              top: -12,
            }}
          />
        )}
      </View>
    </PillButton>
  );
};
