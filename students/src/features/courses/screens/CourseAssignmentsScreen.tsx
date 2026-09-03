import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { useOfflineDisabled } from '@polito/lib/core';
import {
  BottomBarSpacer,
  CtaButton,
  List,
  OverviewList,
  RefreshControl,
} from '@polito/lib/ui';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';

import {
  useAccessibility,
  useAnnounceLoading,
} from '../../../core/hooks/useAccessibilty';
import { useGetCourseAssignments } from '../../../core/queries/courseHooks';
import { CourseAssignmentListItem } from '../components/CourseAssignmentListItem';
import { useCourseContext } from '../contexts/CourseContext';
import { CourseTabsParamList } from '../navigation/CourseNavigator';

type Props = MaterialTopTabScreenProps<
  CourseTabsParamList,
  'CourseAssignmentsScreen'
>;

export const CourseAssignmentsScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const courseId = useCourseContext();
  const assignmentsQuery = useGetCourseAssignments(courseId);
  useAnnounceLoading(assignmentsQuery.isLoading);
  const { getListAccessibilityProps, announceIfEnabled } = useAccessibility();
  const isDisabled = useOfflineDisabled();
  const isCacheMissing = useOfflineDisabled(
    () => assignmentsQuery.data === undefined,
  );

  useFocusEffect(
    useCallback(() => {
      if (!assignmentsQuery?.data) {
        return;
      }
      if (assignmentsQuery?.data?.length === 0) {
        setTimeout(() => {
          announceIfEnabled(t('courseAssignmentsTab.emptyState'));
        }, 500);
      }
    }, [assignmentsQuery, t, announceIfEnabled]),
  );

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl manual queries={[assignmentsQuery]} />}
      >
        <SafeAreaView>
          {!assignmentsQuery.isLoading &&
            assignmentsQuery.data &&
            (assignmentsQuery.data.length > 0 ? (
              <View
                {...getListAccessibilityProps(
                  t('courseAssignmentsTab.title'),
                  assignmentsQuery.data.length,
                )}
              >
                <List indented>
                  {assignmentsQuery.data.map((assignment, index) => (
                    <CourseAssignmentListItem
                      key={assignment.id}
                      item={assignment}
                      index={index}
                      total={assignmentsQuery.data.length}
                      disabled={isDisabled}
                    />
                  ))}
                </List>
              </View>
            ) : (
              <OverviewList
                emptyStateText={t('courseAssignmentsTab.emptyState')}
              />
            ))}
          {isCacheMissing && (
            <OverviewList emptyStateText={t('common.cacheMiss')} />
          )}
          <BottomBarSpacer />
        </SafeAreaView>
      </ScrollView>
      <CtaButton
        title={t('courseAssignmentUploadScreen.title')}
        action={() =>
          navigation.navigate({
            name: 'CourseAssignmentUpload',
            params: { courseId },
          })
        }
        disabled={isDisabled}
        accessibilityState={{ disabled: isDisabled }}
      />
    </>
  );
};
