import { IS_IOS } from '../constants';

/** Props to hide decorative elements from VoiceOver/TalkBack without affecting visuals. */
export const hideFromScreenReader = {
  accessible: false as const,
  importantForAccessibility: 'no-hide-descendants' as const,
  accessibilityElementsHidden: IS_IOS,
};
