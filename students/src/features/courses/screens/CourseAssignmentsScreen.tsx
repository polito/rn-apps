import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView } from 'react-native';

import { useOfflineDisabled } from '@polito/lib/core';
import { useAccessibility } from '@polito/lib/core';
import {
  BottomBarSpacer,
  CtaButton,
  List,
  OverviewList,
  RefreshControl,
} from '@polito/lib/ui';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';

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
  const { accessibilityListLabel } = useAccessibility();
  const isDisabled = useOfflineDisabled();
  const isCacheMissing = useOfflineDisabled(
    () => assignmentsQuery.data === undefined,
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
      />
    </>
  );
};
