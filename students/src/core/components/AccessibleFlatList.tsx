import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccessibilityInfo,
  FlatList,
  FlatListProps,
  View,
  ViewStyle,
} from 'react-native';

import { useAccessibility } from '../hooks/useAccessibilty';

interface AccessibleFlatListProps<T> extends FlatListProps<T> {
  readonly listName: string;
  readonly announceOnFocus?: boolean;
  readonly containerStyle?: ViewStyle;
}

export function AccessibleFlatList<T>(
  props: Readonly<AccessibleFlatListProps<T>>,
) {
  const {
    listName,
    announceOnFocus = true,
    containerStyle,
    renderItem,
    data,
    ...rest
  } = props;
  const { t } = useTranslation();
  const { accessibilityListLabel } = useAccessibility();
  const itemCount = data?.length ?? 0;

  const accessibleRenderItem = useCallback(
    (info: { item: T; index: number; separators: any }) => {
      if (!renderItem) return null;

      const element = renderItem(info);
      const positionLabel = accessibilityListLabel(info.index, itemCount);

      return (
        <View
          accessible={false}
          accessibilityLabel={positionLabel}
          importantForAccessibility="no"
        >
          {element}
        </View>
      );
    },
    [renderItem, accessibilityListLabel, itemCount],
  );

  const handleAccessibilityFocus = useCallback(() => {
    if (announceOnFocus && itemCount > 0) {
      const announcement = t('common.listWithCount', {
        name: listName,
        count: itemCount,
      });
      AccessibilityInfo.announceForAccessibility(announcement);
    }
  }, [announceOnFocus, itemCount, listName, t]);

  return (
    <View
      style={containerStyle}
      accessible={true}
      accessibilityRole="list"
      accessibilityLabel={t('common.listWithCount', {
        name: listName,
        count: itemCount,
      })}
      onAccessibilityTap={handleAccessibilityFocus}
    >
      <FlatList data={data} renderItem={accessibleRenderItem} {...rest} />
    </View>
  );
}
