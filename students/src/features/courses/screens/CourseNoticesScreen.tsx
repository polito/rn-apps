import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

import {
  APP_TIMEZONE,
  formatDate,
  getHtmlTextContent,
  useAccessibilityFocusOnScreenFocus,
  useOfflineDisabled,
} from '@polito/lib/core';
import {
  BottomBarSpacer,
  GlobalStyles,
  IndentedDivider,
  ListItem,
  OverviewList,
  RefreshControl,
  useSafeAreaSpacing,
  useTheme,
} from '@polito/lib/ui';
import { useFocusEffect } from '@react-navigation/native';

import { DateTime } from 'luxon';

import {
  useAccessibility,
  useAnnounceLoading,
} from '../../../core/hooks/useAccessibilty';
import { useNotifications } from '../../../core/hooks/useNotifications';
import { useOnLeaveScreen } from '../../../core/hooks/useOnLeaveScreen';
import { useGetCourseNotices } from '../../../core/queries/courseHooks';
import { useCourseContext } from '../contexts/CourseContext';

export const CourseNoticesScreen = () => {
  const screenRef = useAccessibilityFocusOnScreenFocus<FlatList>(1400);
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const courseId = useCourseContext();
  const noticesQuery = useGetCourseNotices(courseId);
  useAnnounceLoading(noticesQuery.isLoading);
  const {
    buildCompositeListLabel,
    getListAccessibilityProps,
    getListItemAccessibilityProps,
    announceIfEnabled,
  } = useAccessibility();
  const { getUnreadsCount, clearNotificationScope } = useNotifications();
  const { paddingHorizontal } = useSafeAreaSpacing();
  const isCacheMissing = useOfflineDisabled(
    () => noticesQuery.data === undefined,
  );
  const notices = useMemo(
    () =>
      noticesQuery.data?.map(notice => ({
        ...notice,
        title: getHtmlTextContent(notice.content),
      })) ?? [],
    [noticesQuery],
  );
  const noticesNotificationScope = useMemo(
    () => ['teaching', 'courses', `${courseId}`, 'notices'] as const,
    [courseId],
  );

  useOnLeaveScreen(() => {
    clearNotificationScope(noticesNotificationScope);
  });

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        announceIfEnabled(
          notices.length === 0
            ? t('courseNoticesTab.emptyState')
            : t('common.listWithCount', {
                name: t('courseNoticesTab.title'),
                count: notices.length,
              }),
        );
      }, 300);

      return () => clearTimeout(timeout);
    }, [notices, t, announceIfEnabled]),
  );

  return (
    <FlatList
      ref={screenRef}
      {...getListAccessibilityProps(
        t('courseNoticesTab.title'),
        notices?.length || 0,
      )}
      contentInsetAdjustmentBehavior="automatic"
      initialNumToRender={15}
      style={GlobalStyles.grow}
      contentContainerStyle={paddingHorizontal}
      refreshControl={<RefreshControl manual queries={[noticesQuery]} />}
      data={notices}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item: notice, index }) => {
        const unreadPrefix = getUnreadsCount([
          ...noticesNotificationScope,
          `${notice.id}`,
        ])
          ? `${t('common.unread')}, ${t('courseNoticesTab.messageReadAfterGoBack')}`
          : '';
        const dateLabel = DateTime.fromJSDate(notice.publishedAt, {
          zone: APP_TIMEZONE,
        }).toFormat('dd/MM/yyyy');

        return (
          <ListItem
            {...getListItemAccessibilityProps(index)}
            title={notice.title}
            accessibilityRole="button"
            accessibilityHint={t('common.tapToNavigate')}
            accessibilityLabel={buildCompositeListLabel(
              [unreadPrefix, notice.title, dateLabel].filter(Boolean),
              index,
              notices?.length || 0,
            )}
            subtitle={formatDate(notice.publishedAt)}
            linkTo={{
              screen: 'Notice',
              params: {
                noticeId: notice.id,
                courseId,
                date: formatDate(notice.publishedAt),
              },
            }}
            unread={
              !!getUnreadsCount([...noticesNotificationScope, `${notice.id}`])
            }
          />
        );
      }}
      ListFooterComponent={<BottomBarSpacer />}
      ItemSeparatorComponent={() => <IndentedDivider indent={spacing[5]} />}
      ListEmptyComponent={() => {
        if (!noticesQuery.isLoading) {
          return (
            <OverviewList emptyStateText={t('courseNoticesTab.emptyState')} />
          );
        } else if (isCacheMissing) {
          return <OverviewList emptyStateText={t('common.cacheMiss')} />;
        }
        return null;
      }}
    />
  );
};
