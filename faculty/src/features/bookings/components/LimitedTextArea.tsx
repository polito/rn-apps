import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Text,
  TextField,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

const TRANSPARENT = 'transparent';

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
  const { dark, colors, palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const [isFocused, setIsFocused] = useState(false);
  const remainingChars = maxLength - value.length;

  return (
    <View style={[styles.card, isFocused && styles.cardFocused]}>
      <View style={styles.header}>
        <Text style={[styles.label, !isFocused && styles.labelIdle]}>
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
      <TextField
        label={placeholder}
        value={value}
        onChangeText={text => onChange(text.slice(0, maxLength))}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline
        numberOfLines={3}
        maxLength={maxLength}
        accessibilityLabel={label}
        style={styles.field}
        inputStyle={styles.input}
        placeholderTextColor={dark ? colors.secondaryText : palettes.gray[400]}
        selectionColor={palettes.orange[500]}
      />
    </View>
  );
};

const createStyles = ({
  dark,
  colors,
  palettes,
  fontFamilies,
  fontSizes,
  fontWeights,
  shapes,
  spacing,
}: Theme) =>
  StyleSheet.create({
    card: {
      marginHorizontal: spacing[4],
      backgroundColor: dark ? colors.surfaceDark : colors.surface,
      borderRadius: shapes.lg,
      paddingHorizontal: spacing[3],
      paddingTop: spacing[2],
      paddingBottom: spacing[2],
      borderWidth: 1,
      borderColor: TRANSPARENT,
    },
    cardFocused: {
      borderColor: palettes.navy[300],
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
      color: colors.heading,
    },
    labelIdle: {
      color: dark ? colors.secondaryText : palettes.gray[400],
    },
    counter: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: 16,
    },
    counterActive: {
      color: colors.heading,
    },
    field: {
      paddingVertical: 0,
    },
    input: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: 20,
      color: colors.prose,
      overflow: 'hidden',
      paddingHorizontal: 0,
      paddingVertical: 0,
      marginTop: spacing[0.5],
      minHeight: 20,
      borderBottomWidth: 0,
    },
  });
