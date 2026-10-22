import { forwardRef } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps } from 'react-native';

import { Col, Text, Theme, useStylesheet, useTheme } from '@polito/lib/ui';

type ProfileFieldInputProps = Omit<TextInputProps, 'style'> & {
  title: string;
  focused: boolean;
  onPress: () => void;
};

export const ProfileFieldInput = forwardRef<TextInput, ProfileFieldInputProps>(
  ({ title, focused, onPress, ...inputProps }, ref) => {
    const { palettes } = useTheme();
    const styles = useStylesheet(createStyles);

    return (
      <Pressable
        onPress={onPress}
        accessibilityLabel={title}
        style={[styles.card, focused ? styles.cardFocused : styles.cardDimmed]}
      >
        <Col flex={1} style={styles.texts}>
          <Text weight="medium" style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <TextInput
            ref={ref}
            style={[styles.value, styles.input]}
            selectionColor={palettes.orange[600]}
            cursorColor={palettes.orange[600]}
            accessibilityLabel={title}
            onFocus={onPress}
            {...inputProps}
          />
        </Col>
      </Pressable>
    );
  },
);

const createStyles = ({
  colors,
  spacing,
  shapes,
  fontSizes,
  fontFamilies,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 60,
      paddingLeft: spacing[5],
      paddingRight: spacing[4],
      paddingVertical: spacing[1.5],
      borderRadius: shapes.lg,
      borderWidth: 1,
      borderColor: colors.surface,
      backgroundColor: colors.surface,
    },
    cardFocused: {
      borderColor: colors.link,
    },
    cardDimmed: {
      opacity: 0.4,
    },
    texts: {
      gap: 1,
      marginRight: spacing[2],
    },
    title: {
      color: colors.prose,
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.5,
    },
    value: {
      color: colors.prose,
      fontSize: fontSizes.sm,
      lineHeight: fontSizes.sm * 1.5,
    },
    input: {
      fontFamily: fontFamilies.body,
      fontWeight: fontWeights.medium,
      padding: 0,
      margin: 0,
    },
  });
