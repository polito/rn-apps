import { Platform } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../ui/hooks/useTheme';

export const useBottomBarAwareStyles = () => {
  const bottomBarHeight = useBottomTabBarHeight();
  const { spacing } = useTheme();
  return {
    paddingBottom:
       +(Platform.select({ ios: bottomBarHeight }) ?? 0) + +spacing[5],
  };
};