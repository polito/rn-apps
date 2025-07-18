import { TouchableHighlightProps } from 'react-native';
 
 import { FileListItem } from '../../ui/components/FileListItem';
 
 import { formatFileDate, formatFileSize } from './files';
import React from 'react';
import { StudentApi } from '@polito/api-client';
import { AssignmentListItem } from './AssignmentListItem';
 
 interface Props {
   title : string;
   date : string,
   student : string,
   assignmentId : number,

 }
 
 export const CourseAssignmentsListItem = ({
    title,
    date,
    student,
    assignmentId,
   ...rest
 }: Omit<TouchableHighlightProps, 'onPress'> & Props) => {
   return (
     <AssignmentListItem title={title} assignmentId={assignmentId} date={date} student={student}     
     />
   );
 };