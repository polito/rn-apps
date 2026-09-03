import { Ref, useMemo } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewProps,
} from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { useStylesheet } from '../hooks/useStylesheet';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types/Theme';

export interface TextFieldProps extends Omit<TextInputProps, 'placeholder'> {
  inputRef?: Ref<TextInput>;
  label: string;
  type?: 'text' | 'password';
  icon?: IconDefinition;
  style?: ViewProps['style'];
  inputStyle?: TextInputProps['style'];
}

/**
 * A text input field
 */
export const TextField = ({
  inputRef,
  label,
  type,
  style,
  inputStyle,
  numberOfLines = 1,
  autoCapitalize = 'none',
  editable,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  accessibilityRole,
  ...rest
}: TextFieldProps) => {
  const { colors } = useTheme();
  const styles = useStylesheet(createStyles);

  const isDisabled = editable === false;

  const textInputProps: TextInputProps = useMemo(() => {
    switch (type) {
      case 'password':
        return {
          autoComplete: 'password',
          secureTextEntry: true,
        };
      default:
        return {};
    }
  }, [type]);

  return (
    <View
      style={[styles.container, isDisabled && styles.disabled, style]}
      accessible={false}
    >
      <TextInput
        ref={inputRef}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        accessibilityState={{
          disabled: isDisabled,
          ...accessibilityState,
        }}
        editable={editable}
        autoCapitalize={autoCapitalize}
        selectionColor={colors.link}
        placeholder={label}
        placeholderTextColor={colors.secondaryText}
        style={[
          styles.input,
          {
            textAlignVertical: numberOfLines === 1 ? 'center' : 'top',
          },
          inputStyle,
        ]}
        numberOfLines={numberOfLines}
        {...textInputProps}
        {...rest}
      />
    </View>
  );
};

const createStyles = ({ colors, fontSizes, spacing, fontFamilies }: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: spacing[2],
    },
    disabled: {
      opacity: 0.5,
    },
    input: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      borderBottomWidth: Platform.select({ android: 1 }),
      borderColor: colors.secondaryText,
      color: colors.prose,
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[2],
    },
  });
