import { PropsWithChildren, ReactElement, useMemo } from 'react';
import { TextStyle, ViewProps, ViewStyle } from 'react-native';

import { useTheme } from '../hooks/useTheme';
import { Card } from './Card';
import { Text } from './Text';

type Props = PropsWithChildren<
  ViewProps & {
    text?: string;
    style?: ViewStyle;
    testStyle?: TextStyle;
    children?: ReactElement;
    spaced?: boolean;
  }
>;

export const ErrorCard = ({
  text,
  style,
  testStyle,
  children,
  spaced = true,
  accessibilityLabel,
  accessibilityRole = 'alert',
  accessibilityLiveRegion = 'assertive',
  accessible,
  ...rest
}: Props) => {
  const { spacing, fontSizes, colors } = useTheme();

  const formattedText = useMemo(
    () =>
      text
        ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
        : undefined,
    [text],
  );

  const hasCustomContent = Boolean(children);

  return (
    <Card
      accessible={accessible ?? (hasCustomContent ? undefined : true)}
      accessibilityRole={accessibilityRole}
      accessibilityLiveRegion={accessibilityLiveRegion}
      accessibilityLabel={
        hasCustomContent
          ? accessibilityLabel
          : (accessibilityLabel ?? formattedText)
      }
      rounded
      spaced={spaced}
      translucent={false}
      style={[
        {
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: colors.errorCardBorder,
        },
        style,
      ]}
      {...rest}
    >
      {!hasCustomContent ? (
        <Text
          accessible={false}
          style={[
            {
              padding: spacing[5],
              color: colors.errorCardText,
              fontSize: fontSizes.sm,
            },
            testStyle,
          ]}
        >
          {formattedText}
        </Text>
      ) : (
        children
      )}
    </Card>
  );
};
