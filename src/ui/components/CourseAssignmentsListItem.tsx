import { TouchableHighlightProps } from 'react-native';

import { AssignmentListItem } from './AssignmentListItem';

interface Props {
  title: string;
  date: string;
  student: string;
  assignmentId: number;
}

export const CourseAssignmentsListItem = ({
  title,
  date,
  student,
  assignmentId,
}: Omit<TouchableHighlightProps, 'onPress'> & Props) => {
  return (
    <AssignmentListItem
      title={title}
      assignmentId={assignmentId}
      date={date}
      student={student}
    />
  );
};
