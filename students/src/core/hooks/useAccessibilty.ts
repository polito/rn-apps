import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo } from 'react-native';

import { useScreenReader } from './useScreenReader';

export function useAccessibility() {
  const { t } = useTranslation();
  const { isEnabled, announce } = useScreenReader();

  const accessibilityListLabel = useCallback(
    (index: number, total: number, extraText?: string) => {
      const text = t('common.elementCount', {
        count: index + 1,
        total: total,
      });
      return `${text}. ${extraText ?? ''}`;
    },
    [t],
  );

  const getListAccessibilityProps = useCallback(
    (listName: string, itemCount: number) => {
      return {
        accessibilityRole: 'list' as const,
        accessibilityLabel: t('common.listWithCount', {
          name: listName,
          count: itemCount,
        }),
        accessibilityCollection: {
          itemCount,
          rowCount: itemCount,
          columnCount: 1,
          hierarchical: false,
        },
      };
    },
    [t],
  );

  const getListItemAccessibilityProps = useCallback(
    (index: number) => ({
      accessibilityCollectionItem: {
        itemIndex: index,
        rowIndex: index,
        rowSpan: 1,
        columnIndex: 0,
        columnSpan: 1,
        heading: false,
      },
    }),
    [],
  );

  const getTappableAccessibilityProps = useCallback(
    (label: string, hint?: string, role: 'button' | 'link' = 'button') => {
      return {
        accessible: true,
        accessibilityRole: role,
        accessibilityLabel: label,
        accessibilityHint: hint ?? t('common.tapToNavigate'),
      };
    },
    [t],
  );

  const getBadgeAccessibilityLabel = useCallback(
    (badgeCount: number, sectionName?: string) => {
      if (badgeCount === 0) return sectionName ?? '';
      const badgeText = t('common.newItems', { count: badgeCount });
      return sectionName ? `${sectionName}, ${badgeText}` : badgeText;
    },
    [t],
  );

  const announceLoading = useCallback(() => {
    if (isEnabled) {
      announce(t('common.loading'));
    }
  }, [isEnabled, announce, t]);

  const announceIfEnabled = useCallback(
    (message: string) => {
      if (isEnabled) {
        announce(message);
      }
    },
    [isEnabled, announce],
  );

  const buildCompositeListLabel = useCallback(
    (parts: (string | undefined | false)[], index?: number, total?: number) => {
      const content = parts.filter(Boolean).join(', ');
      if (index !== undefined && total !== undefined) {
        return [content, accessibilityListLabel(index, total)]
          .filter(Boolean)
          .join(', ');
      }
      return content;
    },
    [accessibilityListLabel],
  );

  return {
    isScreenReaderEnabled: isEnabled,
    accessibilityListLabel,
    buildCompositeListLabel,
    getListAccessibilityProps,
    getListItemAccessibilityProps,
    getTappableAccessibilityProps,
    getBadgeAccessibilityLabel,
    announceLoading,
    announceIfEnabled,
  };
}

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
