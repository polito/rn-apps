import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo, FlatList } from 'react-native';

import {
  APP_TIMEZONE,
  formatDate,
  getHtmlTextContent,
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
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const courseId = useCourseContext();
  const noticesQuery = useGetCourseNotices(courseId);
  useAnnounceLoading(noticesQuery.isLoading);
  const { accessibilityListLabel, getListAccessibilityProps } =
    useAccessibility();
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
      if (!notices || notices?.length === 0) {
        setTimeout(() => {
          AccessibilityInfo.announceForAccessibility(
            t('courseNoticesTab.emptyState'),
          );
        }, 500);
      }
    }, [notices, t]),
  );

  return (
    <FlatList
      {...getListAccessibilityProps(
        t('courseInfoTab.notices'),
        notices?.length || 0,
      )}
      contentInsetAdjustmentBehavior="automatic"
      initialNumToRender={15}
      style={GlobalStyles.grow}
      contentContainerStyle={paddingHorizontal}
      refreshControl={<RefreshControl manual queries={[noticesQuery]} />}
      data={notices}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item: notice, index }) => (
        <ListItem
          title={notice.title}
          accessibilityLabel={`${
            getUnreadsCount([...noticesNotificationScope, `${notice.id}`])
              ? `${t('common.unread')}, ${t(
                  'courseNoticesTab.messageReadAfterGoBack',
                )}`
              : ''
          } ${t(
            accessibilityListLabel(index, notices?.length || 0),
          )}. ${DateTime.fromJSDate(notice.publishedAt, {
            zone: APP_TIMEZONE,
          }).toFormat('dd/MM/yyyy')}, ${notice.title}`}
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
      )}
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
