import { useState } from 'react';

import { useTheme } from '@polito/lib/ui';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';

export const TabBarButton = ({
  style,
  children,
  ...rest
}: BottomTabBarButtonProps) => {
  const { colors, shapes } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <PlatformPressable
      {...rest}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[
        style,
        {
          borderColor: colors.heading,
          borderRadius: shapes.md,
          borderWidth: isFocused ? 2 : 0,
          padding: isFocused ? 0 : 2,
        },
      ]}
    >
      {children}
    </PlatformPressable>
  );
};
