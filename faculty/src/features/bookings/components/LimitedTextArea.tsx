import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Text, Theme, useStylesheet, useTheme } from '@polito/lib/ui';

import { bookingsColors } from '../utils/bookingsTheme';

interface Props {
  label: string;
  value: string;
  onChange: (text: string) => void;
  maxLength: number;
  placeholder: string;
}

export const LimitedTextArea = ({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
}: Props) => {
  const { dark, colors } = useTheme();
  const styles = useStylesheet(createStyles);
  const [isFocused, setIsFocused] = useState(false);
  const remainingChars = maxLength - value.length;

  return (
    <View style={[styles.card, isFocused && styles.cardFocused]}>
      <View style={styles.header}>
        <Text
          style={[styles.label, !isFocused && styles.labelIdle]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.counter,
            isFocused ? styles.counterActive : styles.labelIdle,
          ]}
        >
          {remainingChars}
        </Text>
      </View>
      <TextInput
        value={value}
        onChangeText={text => onChange(text.slice(0, maxLength))}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={dark ? colors.secondaryText : bookingsColors.placeholder}
        selectionColor={bookingsColors.cursorOrange}
        multiline
        textAlignVertical="top"
        maxLength={maxLength}
        style={styles.input}
      />
    </View>
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
      marginHorizontal: spacing[4],
      backgroundColor: dark ? colors.surfaceDark : bookingsColors.cardSurface,
      borderRadius: shapes.lg,
      paddingHorizontal: spacing[3],
      paddingTop: spacing[2],
      paddingBottom: spacing[2],
      borderWidth: 1,
      borderColor: 'transparent',
    },
    cardFocused: {
      borderColor: bookingsColors.focusBorder,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      lineHeight: 24,
      color: dark ? colors.heading : bookingsColors.textHeading,
    },
    labelIdle: {
      color: dark ? colors.secondaryText : bookingsColors.placeholder,
    },
    counter: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: 16,
    },
    counterActive: {
      color: dark ? colors.heading : bookingsColors.textHeading,
    },
    input: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: 20,
      color: dark ? colors.prose : bookingsColors.textPrimary,
      overflow: 'hidden',
      padding: 0,
      marginTop: spacing[0.5],
      minHeight: 20,
    },
  });
