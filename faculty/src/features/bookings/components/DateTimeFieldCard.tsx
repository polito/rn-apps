import { Pressable, StyleSheet, View } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Icon, Text, Theme, useStylesheet, useTheme } from '@polito/lib/ui';

interface Props {
  icon: IconDefinition;
  label: string;
  value: string;
  onPress: () => void;
  iconSize?: number;
  chevronSize?: number;
  cardHeight?: number;
}

export const DateTimeFieldCard = ({
  icon,
  label,
  value,
  onPress,
  iconSize = 22,
  chevronSize = 14,
  cardHeight = 72,
}: Props) => {
  const { dark, colors, palettes } = useTheme();
  const styles = useStylesheet(createStyles);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.card, { height: cardHeight }]}
    >
      <Icon
        icon={icon}
        size={iconSize}
        color={dark ? colors.secondaryText : palettes.gray[400]}
      />
      <View style={styles.fieldTextBlock}>
        <Text style={styles.fieldLabel} numberOfLines={1}>
          {label}
        </Text>
        <View style={styles.fieldValueRow}>
          <Text style={styles.fieldValue} numberOfLines={1}>
            {value}
          </Text>
          <Icon icon={faChevronDown} size={chevronSize} color={colors.prose} />
        </View>
      </View>
    </Pressable>
  );
};

const createStyles = ({
  dark,
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  shapes,
  spacing,
}: Theme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
      backgroundColor: dark ? colors.surfaceDark : colors.surface,
      borderRadius: shapes.lg,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      overflow: 'hidden',
    },
    fieldTextBlock: {
      flex: 1,
      gap: spacing[0.5],
      minWidth: 0,
    },
    fieldLabel: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: 20,
      color: colors.secondaryText,
    },
    fieldValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1.5],
    },
    fieldValue: {
      flexShrink: 1,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      lineHeight: 24,
      color: colors.prose,
    },
  });
