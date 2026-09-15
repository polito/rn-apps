import { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleProp,
  TextStyle,
  TouchableHighlightProps,
  View,
} from 'react-native';

import { PillButton } from '@polito/lib/ui';

import color from 'color';

import { hideFromScreenReader } from '../../core/accessibility/hideFromScreenReader';
import { IS_IOS } from '../../core/constants';
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
  accessibilityLabel,
  accessibilityState,
  accessibilityHint,
  ...rest
}: PropsWithChildren<TouchableHighlightProps & TabProps>) => {
  const { dark, palettes, fontSizes, fontWeights } = useTheme();
  const { t } = useTranslation();

  const label = useMemo(() => {
    if (accessibilityLabel) return accessibilityLabel;
    if (typeof children !== 'string') return undefined;
    if (badge != null && !Number.isNaN(Number(badge))) {
      const count = Number(badge);
      if (count > 0) {
        return `${children}, ${t('common.newItems', { count })}`;
      }
    }
    return children;
  }, [accessibilityLabel, children, badge, t]);

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
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        selected,
        ...accessibilityState,
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
      <View
        style={{ position: 'relative' }}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden={IS_IOS}
      >
        <Text
          accessible={false}
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
          <View {...hideFromScreenReader}>
            <UnreadBadge
              text={badge}
              style={{
                position: 'absolute',
                right: -15,
                top: -12,
              }}
            />
          </View>
        )}
      </View>
    </PillButton>
  );
};
