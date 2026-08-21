import { AccessibilityInfo } from 'react-native';

export const setTimeoutAccessibilityInfoHelper = (
  message: string,
  ms: number,
) => {
  setTimeout(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(enabled => {
      if (enabled) {
        AccessibilityInfo.announceForAccessibility(message);
      }
    });
  }, ms);
};
