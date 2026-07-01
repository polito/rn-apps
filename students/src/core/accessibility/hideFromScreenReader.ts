import { IS_IOS } from '@polito/lib/core';

/** Props to hide decorative elements from VoiceOver/TalkBack without affecting visuals. */
export const hideFromScreenReader = {
  accessible: false as const,
  importantForAccessibility: 'no-hide-descendants' as const,
  accessibilityElementsHidden: IS_IOS,
};
