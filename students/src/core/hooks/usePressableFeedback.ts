import { useMemo } from 'react';
import { PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';

import { IS_IOS } from '@polito/lib/core';
import { useTheme } from '@polito/lib/ui';

/**
 * Press feedback for `Pressable` buttons: a ripple on Android and, on iOS,
 * the same feedback as the `Touchable*` component it replaces.
 *
 * @param variant `highlight` darkens the background like `TouchableHighlight`,
 * `opacity` fades the content like `TouchableOpacity`
 *
 * @example
 * const feedback = usePressableFeedback();
 * <Pressable
 *   android_ripple={feedback.androidRipple}
 *   style={feedback.style(styles.button)}
 * />
 */
export const usePressableFeedback = (
  variant: 'highlight' | 'opacity' = 'highlight',
) => {
  const { colors } = useTheme();

  return useMemo(() => {
    const pressedStyle: ViewStyle =
      variant === 'opacity'
        ? { opacity: 0.2 }
        : { backgroundColor: colors.touchableHighlight };

    return {
      androidRipple: { color: colors.touchableHighlight },
      style:
        (style?: StyleProp<ViewStyle>) =>
        ({ pressed }: PressableStateCallbackType) => [
          style,
          IS_IOS && pressed && pressedStyle,
        ],
    };
  }, [colors.touchableHighlight, variant]);
};
