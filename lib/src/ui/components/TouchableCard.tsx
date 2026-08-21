import { PropsWithChildren } from 'react';
import {
  StyleProp,
  TouchableHighlight,
  TouchableHighlightProps,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { useKeyboardActivation } from '../hooks/useKeyboardActivation';
import { useTheme } from '../hooks/useTheme';
import { Card } from './Card';

export type TouchableCardProps = PropsWithChildren<
  ViewProps &
    TouchableHighlightProps & {
      /**
       * Toggles the rounded corners
       */
      rounded?: boolean;
      cardStyle?: StyleProp<ViewStyle>;
    }
>;

export const TouchableCard = ({
  children,
  style,
  cardStyle,
  rounded = true,
  disabled,
  accessibilityRole,
  accessibilityState,
  ...rest
}: TouchableCardProps) => {
  const { colors, shapes } = useTheme();
  const keyboardActivationProps = useKeyboardActivation({
    onActivate: rest.onPress as (() => void) | undefined,
    disabled,
    accessibilityActions: rest.accessibilityActions,
    onAccessibilityAction: rest.onAccessibilityAction,
  });

  return (
    <TouchableHighlight
      underlayColor={colors.touchableHighlight}
      style={[rounded && { borderRadius: shapes.lg }, style]}
      disabled={disabled}
      accessible
      accessibilityRole={
        accessibilityRole ?? (rest.onPress ? 'button' : undefined)
      }
      accessibilityState={{ disabled: !!disabled, ...accessibilityState }}
      {...rest}
      {...keyboardActivationProps}
    >
      <Card
        style={[
          { marginVertical: 0 },
          disabled && { opacity: 0.5, elevation: 0 },
          cardStyle,
        ]}
        spaced={false}
        rounded
      >
        {children}
      </Card>
    </TouchableHighlight>
  );
};
