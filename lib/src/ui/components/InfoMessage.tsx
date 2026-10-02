import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCircleInfo,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';

import { useStylesheet } from '../hooks/useStylesheet';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types/Theme';
import { Icon } from './Icon';
import { Text } from './Text';

export type InfoMessageVariant = 'warning' | 'info' | 'error';

type Props = ViewProps & {
  variant?: InfoMessageVariant;
  icon?: IconDefinition;
};

export const InfoMessage = ({
  children,
  variant = 'info',
  icon,
  style,
  ...rest
}: PropsWithChildren<Props>) => {
  const styles = useStylesheet(createStyles);
  const { palettes, dark } = useTheme();

  const palette =
    variant === 'warning'
      ? palettes.warning
      : variant === 'error'
        ? palettes.error
        : palettes.info;

  const borderColor = palette[dark ? 500 : 600];
  const textColor = palette[dark ? 200 : 800];
  const backgroundColor = palette[dark ? 900 : 50];

  const defaultIcon =
    variant === 'warning'
      ? faTriangleExclamation
      : variant === 'error'
        ? faTriangleExclamation
        : faCircleInfo;

  return (
    <View
      style={[styles.container, { borderColor, backgroundColor }, style]}
      accessibilityRole="alert"
      {...rest}
    >
      <View style={styles.iconWrapper}>
        <Icon icon={icon ?? defaultIcon} color={textColor} size={16} />
      </View>
      <View style={styles.body}>
        {typeof children === 'string' ? (
          <Text style={[styles.text, { color: textColor }]} weight="medium">
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
};

const createStyles = ({ spacing, shapes, fontSizes }: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing[3],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      borderRadius: shapes.md,
      borderWidth: 1,
    },
    iconWrapper: {
      paddingTop: spacing[1],
    },
    body: {
      flex: 1,
    },
    text: {
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.sm * 1.5,
    },
  });
