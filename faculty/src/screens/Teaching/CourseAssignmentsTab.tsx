import { FlatList } from 'react-native';

import { faInbox } from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  EmptyState,
  GlobalStyles,
  IndentedDivider,
  useSafeAreaSpacing,
} from '@polito/lib/ui';

import { CourseAssignmentsListItem } from '../../core/components/CourseAssignmentsListItem';
import { useCourses } from '../../core/contexts/CoursesContext';

export const CourseAssignmentsTab = () => {
  const { paddingHorizontal } = useSafeAreaSpacing();
  const { selectedCourse } = useCourses();
  // Troviamo il corso corrispondente
  const course = selectedCourse;

  // Se il corso non esiste, restituiamo null
  if (!course) {
    return null;
  }

  const { assignments } = course;

  if (selectedCourse == null) return null;

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      initialNumToRender={15}
      style={GlobalStyles.grow}
      contentContainerStyle={paddingHorizontal}
      data={assignments}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item: assign }) => (
        <CourseAssignmentsListItem
          assignmentId={assign.id}
          title={assign.name}
          date={assign.date}
          student={assign.student}
        />
      )}
      ListFooterComponent={<BottomBarSpacer />}
      ItemSeparatorComponent={() => <IndentedDivider />}
      ListEmptyComponent={() => {
        if (assignments.length === 0) {
          return <EmptyState icon={faInbox} message="Notices empty" />;
        }
        return null;
      }}
    />
  );
};
