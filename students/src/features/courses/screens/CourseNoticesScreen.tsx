import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

import { useOfflineDisabled } from '@polito/lib';
import { APP_TIMEZONE, formatDate } from '@polito/lib';
import { getHtmlTextContent } from '@polito/lib';
import { BottomBarSpacer } from '@polito/lib';
import { IndentedDivider } from '@polito/lib';
import { ListItem } from '@polito/lib';
import { OverviewList } from '@polito/lib';
import { RefreshControl } from '@polito/lib';
import { useTheme } from '@polito/lib';
import { GlobalStyles } from '@polito/lib';

import { DateTime } from 'luxon';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { useNotifications } from '../../../core/hooks/useNotifications';
import { useOnLeaveScreen } from '../../../core/hooks/useOnLeaveScreen';
import { useSafeAreaSpacing } from '../../../core/hooks/useSafeAreaSpacing';
import { useGetCourseNotices } from '../../../core/queries/courseHooks';
import { useCourseContext } from '../contexts/CourseContext';

export const CourseNoticesScreen = () => {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const courseId = useCourseContext();
  const noticesQuery = useGetCourseNotices(courseId);
  const { accessibilityListLabel } = useAccessibility();
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
    () => ['teaching', 'courses', courseId.toString(), 'notices'],
    [courseId],
  );

  useOnLeaveScreen(() => {
    clearNotificationScope(noticesNotificationScope);
  });

  return (
    <FlatList
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
          accessibilityLabel={`${t(
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
          unread={!!getUnreadsCount([...noticesNotificationScope, notice.id])}
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
