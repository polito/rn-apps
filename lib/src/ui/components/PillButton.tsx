import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { useKeyboardActivation } from '../hooks/useKeyboardActivation';
import { useStylesheet } from '../hooks/useStylesheet';
import { Theme } from '../types/Theme';
import { Text } from './Text';

export type PillButtonProps = TouchableOpacityProps & {
  variant?: 'primary' | 'neutral';
};

export const PillButton = ({
  children,
  style,
  variant = 'primary',
  accessibilityRole = 'button',
  accessibilityState,
  disabled,
  ...props
}: PillButtonProps) => {
  const styles = useStylesheet(createStyles);
  const keyboardActivationProps = useKeyboardActivation({
    onActivate: props.onPress as (() => void) | undefined,
    disabled,
    accessibilityActions: props.accessibilityActions,
    onAccessibilityAction: props.onAccessibilityAction,
  });

  return (
    <TouchableOpacity
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled: !!disabled, ...accessibilityState }}
      disabled={disabled}
      style={[
        styles.container,
        variant === 'neutral'
          ? styles.containerNeutral
          : styles.containerPrimary,
        style,
      ]}
      activeOpacity={0.7}
      {...props}
      {...keyboardActivationProps}
    >
      {typeof children === 'string' ? (
        <Text
          style={[
            styles.text,
            variant === 'neutral' ? styles.textNeutral : styles.textPrimary,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const createStyles = ({ palettes, spacing, fontWeights, colors }: Theme) =>
  StyleSheet.create({
    container: {
      borderRadius: spacing[2.5],
      paddingHorizontal: spacing[2.5],
      paddingVertical: spacing[1.5] / 2,
      borderWidth: 1,
    },
    containerNeutral: {
      borderColor: palettes.gray[500],
      borderWidth: 1,
    },
    containerPrimary: {
      backgroundColor: palettes.primary[500],
    },
    text: {
      fontWeight: fontWeights.medium,
    },
    textNeutral: {},
    textPrimary: {
      color: colors.white,
    },
  });
