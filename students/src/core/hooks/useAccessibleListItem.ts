import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo, AccessibilityRole } from 'react-native';

export function useAccessibleListItem() {
  const { t } = useTranslation();

  const getListItemAccessibilityProps = useCallback(
    (
      index: number,
      total: number,
      label: string,
      hint?: string,
      role: AccessibilityRole = 'button',
    ) => {
      const positionLabel = t('common.elementCount', {
        count: index + 1,
        total,
      });

      return {
        accessible: true,
        accessibilityRole: role,
        accessibilityLabel: [label, positionLabel.trim()]
          .filter(Boolean)
          .join(', '),
        ...(hint && { accessibilityHint: hint }),
      };
    },
    [t],
  );

  const getListContainerAccessibilityProps = useCallback(
    (name: string, count: number) => {
      return {
        accessible: true,
        accessibilityRole: 'list' as const,
        accessibilityLabel: t('common.listWithCount', { name, count }),
      };
    },
    [t],
  );

  const announceListInfo = useCallback(
    (name: string, count: number) => {
      AccessibilityInfo.isScreenReaderEnabled().then(enabled => {
        if (enabled) {
          AccessibilityInfo.announceForAccessibility(
            t('common.listWithCount', { name, count }),
          );
        }
      });
    },
    [t],
  );

  return {
    getListItemAccessibilityProps,
    getListContainerAccessibilityProps,
    announceListInfo,
  };
}
