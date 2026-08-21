import { useCallback, useRef } from 'react';
import { AccessibilityInfo, findNodeHandle } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

export const useAccessibilityFocus = <T>() => {
  const ref = useRef<T>(null);

  const focus = useCallback(() => {
    const node = findNodeHandle(ref.current as never);
    if (node != null) {
      AccessibilityInfo.setAccessibilityFocus(node);
    }
  }, []);

  return [ref, focus] as const;
};

export const useAccessibilityFocusOnScreenFocus = <T>(delay = 300) => {
  const [ref, focus] = useAccessibilityFocus<T>();

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(async () => {
        if (await AccessibilityInfo.isScreenReaderEnabled()) {
          focus();
        }
      }, delay);

      return () => clearTimeout(timeout);
    }, [focus, delay]),
  );

  return ref;
};
