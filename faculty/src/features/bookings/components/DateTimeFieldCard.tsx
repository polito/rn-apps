import { Pressable, StyleSheet, View } from 'react-native';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
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
  const { dark, colors } = useTheme();
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
        color={dark ? colors.secondaryText : TEXT_HEADING}
      />
      <View style={styles.fieldTextBlock}>
        <Text style={styles.fieldLabel} numberOfLines={1}>
          {label}
        </Text>
        <View style={styles.fieldValueRow}>
          <Text style={styles.fieldValue} numberOfLines={1}>
            {value}
          </Text>
          <Icon
            icon={faChevronDown}
            size={chevronSize}
            color={dark ? colors.prose : TEXT_SUBTITLE}
          />
        </View>
      </View>
    </Pressable>
  );
};

const CARD_SURFACE = '#FFFFFF';
const TEXT_HEADING = '#45556C';
const TEXT_PRIMARY = '#262626';
const TEXT_SUBTITLE = '#314158';

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
      backgroundColor: dark ? colors.surfaceDark : CARD_SURFACE,
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
      color: dark ? colors.secondaryText : TEXT_PRIMARY,
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
      color: dark ? colors.prose : TEXT_SUBTITLE,
    },
  });
