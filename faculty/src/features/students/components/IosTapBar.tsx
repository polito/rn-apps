import type { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { Text, TextButton, Theme, useStylesheet } from '@polito/lib/ui';

type IosTopBarProps = {
  backgroundColor: string;
  grabberColor: string;
  dividerColor: string;
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

type IosTopBarTextActionProps = {
  label: string;
  onPress: () => void;
  color: string;
  disabled?: boolean;
  align?: 'left' | 'center' | 'right';
  containerStyle?: ViewStyle;
};

export const IosTopBar = ({
  backgroundColor,
  grabberColor,
  dividerColor,
  left,
  center,
  right,
}: IosTopBarProps) => {
  const styles = useStylesheet(createStyles);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.grabber, { backgroundColor: grabberColor }]} />
      <View style={styles.headerRow}>
        <View style={styles.sideSlot}>{left}</View>
        <View style={styles.centerSlot}>{center}</View>
        <View style={[styles.sideSlot, styles.rightSlot]}>{right}</View>
      </View>
      <View style={[styles.divider, { backgroundColor: dividerColor }]} />
    </View>
  );
};

export const IosTopBarTextAction = ({
  label,
  onPress,
  color,
  disabled = false,
  align = 'left',
  containerStyle,
}: IosTopBarTextActionProps) => {
  const styles = useStylesheet(createStyles);

  return (
    <TextButton
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={[
        styles.textActionButton,
        align === 'left'
          ? styles.alignStart
          : align === 'right'
            ? styles.alignEnd
            : styles.alignCenter,
        containerStyle,
      ]}
    >
      <Text style={[styles.textActionLabel, { color }]}>{label}</Text>
    </TextButton>
  );
};

const createStyles = ({
  spacing,
  fontFamilies,
  fontWeights,
  palettes,
}: Theme) =>
  StyleSheet.create({
    container: {
      alignSelf: 'stretch',
    },
    grabber: {
      alignSelf: 'center',
      width: 36,
      height: 5,
      borderRadius: 999,
      marginTop: spacing[1.5],
      // Keep light theme handle subtle per latest design.
      backgroundColor: palettes.gray[400],
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[5],
      paddingTop: spacing[0.5],
      paddingBottom: spacing[2],
      minHeight: 46,
      gap: spacing[2],
    },
    sideSlot: {
      minWidth: 56,
      flexShrink: 0,
      justifyContent: 'center',
    },
    rightSlot: {
      alignItems: 'flex-end',
    },
    centerSlot: {
      flex: 1,
      minWidth: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      width: '100%',
    },
    textActionButton: {
      minHeight: 28,
      paddingVertical: spacing[1],
      paddingHorizontal: 0,
      marginRight: 0,
      justifyContent: 'center',
    },
    alignStart: {
      alignItems: 'flex-start',
    },
    alignCenter: {
      alignItems: 'center',
    },
    alignEnd: {
      alignItems: 'flex-end',
    },
    textActionLabel: {
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontWeight: fontWeights.normal,
      lineHeight: 22,
      letterSpacing: -0.43,
    },
  });
