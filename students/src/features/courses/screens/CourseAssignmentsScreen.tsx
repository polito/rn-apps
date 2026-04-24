import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { useOfflineDisabled } from '@polito/lib/core';
import {
  BottomBarSpacer,
  CtaButton,
  List,
  OverviewList,
  RefreshControl,
} from '@polito/lib/ui';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { useGetCourseAssignments } from '../../../core/queries/courseHooks';
import { CourseAssignmentListItem } from '../components/CourseAssignmentListItem';
import { useCourseContext } from '../contexts/CourseContext';
import { useOptionalCourseTabContentTopStyle } from '../hooks/useCourseCollapsingContentStyle';
import { useCourseCollapsingTabScroll } from '../hooks/useCourseCollapsingTabScroll';
import { CourseTabsParamList } from '../navigation/CourseNavigator';

type Props = MaterialTopTabScreenProps<
  CourseTabsParamList,
  'CourseAssignmentsScreen'
>;

const assignmentsStyles = StyleSheet.create({
  grow: { flex: 1 },
});

export const CourseAssignmentsScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const courseId = useCourseContext();
  const assignmentsQuery = useGetCourseAssignments(courseId);
  const { accessibilityListLabel } = useAccessibility();
  const isDisabled = useOfflineDisabled();
  const isCacheMissing = useOfflineDisabled(
    () => assignmentsQuery.data === undefined,
  );
  const { scrollHandler } = useCourseCollapsingTabScroll();
  const topContentStyle = useOptionalCourseTabContentTopStyle();

  return (
    <>
      <Animated.ScrollView
        style={assignmentsStyles.grow}
        contentContainerStyle={topContentStyle}
        contentInsetAdjustmentBehavior="never"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl manual queries={[assignmentsQuery]} />}
      >
        <SafeAreaView>
          {!assignmentsQuery.isLoading &&
            assignmentsQuery.data &&
            (assignmentsQuery.data.length > 0 ? (
              <List indented>
                {assignmentsQuery.data.map((assignment, index) => (
                  <CourseAssignmentListItem
                    key={assignment.id}
                    item={assignment}
                    accessibilityListLabel={accessibilityListLabel(
                      index,
                      assignmentsQuery.data.length,
                    )}
                    disabled={isDisabled}
                  />
                ))}
              </List>
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
      </Animated.ScrollView>
      <CtaButton
        title={t('courseAssignmentUploadScreen.title')}
        action={() =>
          navigation.navigate({
            name: 'CourseAssignmentUpload',
            params: { courseId },
          })
        }
        disabled={isDisabled}
      />
    </>
  );
};
