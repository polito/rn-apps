import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo } from 'react-native';

/** Announces loading when the flag transitions to true and screen reader is on. */
export function useAnnounceLoading(isLoading: boolean) {
  const { t } = useTranslation();
  const prevLoadingRef = useRef(isLoading);

  useEffect(() => {
    if (isLoading && !prevLoadingRef.current) {
      AccessibilityInfo.isScreenReaderEnabled().then(enabled => {
        if (enabled) {
          AccessibilityInfo.announceForAccessibility(t('common.loading'));
        }
      });
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading, t]);
}
