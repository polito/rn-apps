import { useEffect } from 'react';
import { StatusBar } from 'react-native';

import { IS_ANDROID } from '@polito/lib/core';
import { displayTabBar, hideTabBar } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';

export const useFullscreenUi = (fullscreen: boolean) => {
  const navigation = useNavigation();

  useEffect(() => {
    const navRoot = navigation.getParent()!;
    if (IS_ANDROID) {
      if (fullscreen) {
        hideTabBar(navRoot);
        navigation.setOptions({ headerShown: false });
      }
    }
    return () => {
      StatusBar.setHidden(false, 'slide');
      navigation.setOptions({ headerShown: true });
      displayTabBar(navRoot);
    };
  }, [fullscreen, navigation]);
};
