import { IS_IOS } from '../constants';

export const hideFromScreenReader = {
  accessible: false as const,
  importantForAccessibility: 'no-hide-descendants' as const,
  accessibilityElementsHidden: IS_IOS,
};
