import { useCallback } from 'react';
import { Platform } from 'react-native';

import { tabBarStyle } from '@polito/lib/ui';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

type UseHideTabsOptions = {
  hideOnIos?: boolean;
};
let hideRequests = 0;

export const useHideTabs = (
  onFocusIn?: () => void,
  onFocusOut?: () => void,
  { hideOnIos = false }: UseHideTabsOptions = {},
) => {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      // Ios tab bar is hidden by default in modal context
      const shouldHide = Platform.OS === 'android' || hideOnIos;
      if (shouldHide) {
        hideRequests += 1;
        parent?.setOptions({
          tabBarStyle: { display: 'none' },
        });
      }
      onFocusIn?.();
      return () => {
        if (shouldHide) {
          hideRequests -= 1;
          if (hideRequests <= 0) {
            hideRequests = 0;
            parent?.setOptions({
              tabBarStyle,
            });
          }
        }
        onFocusOut?.();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, hideOnIos]),
  );
};
