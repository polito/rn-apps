import { PropsWithChildren, useMemo } from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableHighlightProps,
  View,
} from 'react-native';

import { PillButton } from '@polito/lib/ui';

import color from 'color';

import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';
import { UnreadBadge } from './UnreadBadge';

export interface TabProps {
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
}: PropsWithChildren<TouchableHighlightProps & TabProps>) => {
  const { dark, palettes, fontSizes, fontWeights } = useTheme();
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
          borderWidth: 1,
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
              fontSize: fontSizes.xs + 1,
              lineHeight: 19.5,
              fontFamily: 'Montserrat-Medium',
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
