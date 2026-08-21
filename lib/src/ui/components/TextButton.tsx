import { PropsWithChildren } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { useKeyboardActivation } from '../hooks/useKeyboardActivation';
import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';

export const TextButton = ({
  children,
  style,
  accessibilityRole = 'button',
  accessibilityState,
  disabled,
  ...rest
}: PropsWithChildren<TouchableOpacityProps>) => {
  const { palettes, spacing, fontWeights, fontSizes } = useTheme();
  const keyboardActivationProps = useKeyboardActivation({
    onActivate: rest.onPress as (() => void) | undefined,
    disabled,
    accessibilityActions: rest.accessibilityActions,
    onAccessibilityAction: rest.onAccessibilityAction,
  });
  return (
    <TouchableOpacity
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled: !!disabled, ...accessibilityState }}
      disabled={disabled}
      style={[
        {
          padding: spacing[2],
          marginRight: -spacing[2],
        },
        style,
      ]}
      {...rest}
      {...keyboardActivationProps}
    >
      <Text
        style={{
          color: palettes.primary[400],
          fontWeight: fontWeights.semibold,
          fontSize: fontSizes.md,
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};
