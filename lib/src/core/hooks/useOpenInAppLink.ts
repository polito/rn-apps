import { useCallback } from 'react';
import { DeviceEventEmitter } from 'react-native';

import * as WebBrowser from 'expo-web-browser';

import { useTheme } from '../../ui/hooks/useTheme';
import { POLITO_AUTH_REDIRECT_EVENT, getPolitoDeepLinkPrefix } from '../config';
import { IS_IOS } from '../constants';

export enum WebviewType {
  NORMAL,
  LOGIN,
}

export const useOpenInAppLink = (type: WebviewType = WebviewType.NORMAL) => {
  const { colors } = useTheme();

  return useCallback(
    async (url: string) => {
      const opts:
        | WebBrowser.AuthSessionOpenOptions
        | WebBrowser.WebBrowserOpenOptions = {
        showTitle: true,
        controlsColor: colors.link,
        toolbarColor: colors.headersBackground,
        secondaryToolbarColor: colors.headersBackground,
        enableBarCollapsing: true,
        showInRecents: false,
        createTask: false,
        readerMode: false,
      };
      if (type === WebviewType.LOGIN) {
        const out = (await WebBrowser.openAuthSessionAsync(
          url,
          getPolitoDeepLinkPrefix(),
          opts,
        )) as WebBrowser.WebBrowserRedirectResult;
        if (IS_IOS && out.url) {
          DeviceEventEmitter.emit(POLITO_AUTH_REDIRECT_EVENT, out.url);
        }
      } else {
        await WebBrowser.openBrowserAsync(url, opts);
      }
    },
    [colors, type],
  );
};
