import { useTheme } from '@polito/lib';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export const useBottomBarAwareStyles = (addSpacing: boolean = true) => {
  const bottomBarHeight = useBottomTabBarHeight();
  const { spacing } = useTheme();
  return {
    paddingBottom: bottomBarHeight + (addSpacing ? +spacing[5] : 0),
  };
};
