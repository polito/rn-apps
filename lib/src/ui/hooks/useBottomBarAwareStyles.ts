import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { useTheme } from './useTheme';

export const useBottomBarAwareStyles = (addSpacing: boolean = true) => {
  const bottomBarHeight = useBottomTabBarHeight();
  const { spacing } = useTheme();
  return {
    paddingBottom: bottomBarHeight + (addSpacing ? +spacing[5] : 0),
  };
};
