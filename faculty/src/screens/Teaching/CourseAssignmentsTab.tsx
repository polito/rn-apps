import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';

import { faInbox } from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  EmptyState,
  OverviewList,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';

import { AssignmentListItem } from '../../core/components/AssignmentListItem';
import { useCourses } from '../../core/contexts/CoursesContext';

export const CourseAssignmentsTab = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { selectedCourse } = useCourses();

  if (!selectedCourse) {
    return null;
  }

  const { assignments } = selectedCourse;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
    >
      {assignments.length === 0 ? (
        <EmptyState
          icon={faInbox}
          message={t('courseAssignmentsTab.emptyState')}
        />
      ) : (
        <OverviewList indented rounded>
          {assignments.map(assignment => (
            <AssignmentListItem key={assignment.id} assignment={assignment} />
          ))}
        </OverviewList>
      )}
      <BottomBarSpacer />
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    content: {
      paddingTop: spacing[4],
    },
  });
