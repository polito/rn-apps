import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo, Linking } from 'react-native';

import { IS_IOS } from '@polito/lib/core';
import { useTheme } from '@polito/lib/ui';

import * as WebBrowser from 'expo-web-browser';

const ANNOUNCEMENT_DELAY = 500;
const ANNOUNCEMENT_DURATION = 2400;

export enum WebviewType {
  NORMAL,
  LOGIN,
}

export const useOpenInAppLink = (type: WebviewType = WebviewType.NORMAL) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return useCallback(
    async (url: string) => {
      const isScreenReaderEnabled =
        await AccessibilityInfo.isScreenReaderEnabled();

      if (isScreenReaderEnabled) {
        setTimeout(() => {
          AccessibilityInfo.announceForAccessibility(
            t('common.openingExternalLink'),
          );
        }, ANNOUNCEMENT_DELAY);
        await new Promise(resolve =>
          setTimeout(resolve, ANNOUNCEMENT_DELAY + ANNOUNCEMENT_DURATION),
        );
      }
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
          null,
          opts,
        )) as WebBrowser.WebBrowserRedirectResult;
        if (IS_IOS && out.url) {
          Linking.openURL(out.url);
        }
      } else {
        await WebBrowser.openBrowserAsync(url, opts);
      }
    },
    [colors, type, t],
  );
};
