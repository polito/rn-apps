import { useCallback, useMemo } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

import { linkUrls, sanitizeHtml } from '@polito/lib/core';
import { BottomBarSpacer, RefreshControl, useTheme } from '@polito/lib/ui';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useNotifications } from '../../../core/hooks/useNotifications';
import { useGetCourseNotices } from '../../../core/queries/courseHooks';
import { TeachingStackParamList } from '../../teaching/components/TeachingNavigator';
import { HtmlMessage } from '../../tickets/components/HtmlMessage';

type Props = NativeStackScreenProps<TeachingStackParamList, 'Notice'>;

export const NoticeScreen = ({ route }: Props) => {
  const { noticeId, courseId } = route.params;
  const { spacing } = useTheme();
  const { clearNotificationScope } = useNotifications();
  const noticesQuery = useGetCourseNotices(courseId);

  const message = useMemo(
    () =>
      linkUrls(
        sanitizeHtml(
          noticesQuery.data?.find(notice => notice.id === noticeId)?.content ??
            '',
        ),
      ),
    [noticesQuery, noticeId],
  );

  useFocusEffect(
    useCallback(() => {
      clearNotificationScope([
        'teaching',
        'courses',
        `${courseId}`,
        'notices',
        `${noticeId}`,
      ]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[noticesQuery]} manual />}
    >
      <SafeAreaView>
        <HtmlMessage
          message={message}
          baseStyle={{
            paddingTop: 0,
            paddingHorizontal: spacing[5],
          }}
        />
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};
