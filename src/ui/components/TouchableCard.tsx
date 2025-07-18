import { PropsWithChildren } from 'react';
import {
  StyleProp,
  TouchableHighlight,
  TouchableHighlightProps,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { Card } from './Card';
import { useTheme } from '../../ui/hooks/useTheme';
import React from 'react';

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
  ...rest
}: TouchableCardProps) => {
  const { colors, shapes } = useTheme();

  return (
    <TouchableHighlight
      underlayColor={colors.touchableHighlight}
      style={[rounded && { borderRadius: shapes.lg }, style]}
      disabled={disabled}
      {...rest}
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