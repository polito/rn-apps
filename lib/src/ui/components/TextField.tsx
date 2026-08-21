import { Ref, useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Text } from './Text';

export interface TextFieldProps extends Omit<TextInputProps, 'placeholder'> {
  inputRef?: Ref<TextInput>;
  label: string;
  type?: 'text' | 'password';
  icon?: IconDefinition;
  style?: ViewProps['style'];
  inputStyle?: TextInputProps['style'];
  showLabel?: boolean;
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
  showLabel = false,
  ...rest
}: TextFieldProps) => {
  const { colors } = useTheme();
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();
  const labelId = useId();

  const usesPlaceholderAsName = !showLabel && accessibilityLabel == null;

  const accessibleName = useMemo(() => {
    if (usesPlaceholderAsName) {
      return undefined;
    }
    const name = accessibilityLabel ?? label;
    if (accessibilityRole === 'search' && Platform.OS === 'android') {
      return `${name}, ${t('common.searchField')}`;
    }
    return name;
  }, [accessibilityLabel, accessibilityRole, label, t, usesPlaceholderAsName]);

  const accessibleHint = useMemo(() => {
    if (
      usesPlaceholderAsName &&
      accessibilityRole === 'search' &&
      Platform.OS === 'android'
    ) {
      return [t('common.searchField'), accessibilityHint]
        .filter(Boolean)
        .join('. ');
    }
    return accessibilityHint;
  }, [accessibilityHint, accessibilityRole, t, usesPlaceholderAsName]);

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
      {showLabel && (
        <Text variant="secondaryText" nativeID={labelId} style={styles.label}>
          {label}
        </Text>
      )}
      <TextInput
        ref={inputRef}
        accessible={true}
        accessibilityLabel={accessibleName}
        accessibilityLabelledBy={showLabel ? labelId : undefined}
        accessibilityHint={accessibleHint}
        accessibilityRole={accessibilityRole}
        accessibilityState={{
          disabled: isDisabled,
          ...accessibilityState,
        }}
        editable={editable}
        autoCapitalize={autoCapitalize}
        selectionColor={colors.link}
        placeholder={showLabel ? undefined : label}
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
    label: {
      fontSize: fontSizes.sm,
      paddingHorizontal: spacing[5],
      paddingBottom: spacing[1],
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
