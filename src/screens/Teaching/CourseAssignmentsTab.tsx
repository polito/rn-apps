import { Fragment, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { List } from '../../ui/components/List';
import { ListItem } from '../../ui/components/ListItem';
import { useTheme } from '../../ui/hooks/useTheme';
import { useCourses } from '../../core/contexts/CoursesContext';
import React from 'react';
import { GlobalStyles } from '../../core/components/GlobalStyles';
import { useSafeAreaSpacing } from '../../core/hooks/useSafeAreaSpacing';
import { formatDate } from '../../utils/dates';
import { BottomBarSpacer } from '../../core/components/BottomBarSpacer';
import { IndentedDivider } from '../../ui/components/IndentedDivider';
import { EmptyState } from '../../ui/components/EmptyState';
import { faEllipsisV, faInbox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import Popover from 'react-native-popover-view';
import { Text } from '../../ui/components/Text';
import { CourseAssignmentsListItem } from '../../ui/components/CourseAssignmentsListItem';

export const CourseAssignmentsTab = () => {
  const { fakeCourses } = useCourses();
  const { fontSizes, colors, spacing } = useTheme();
  
   const { selectedCourse } = useCourses()
    // Troviamo il corso corrispondente
    const course = selectedCourse;

  // Se il corso non esiste, restituiamo null
  if (!course) {
    return null;
  }
  const { paddingHorizontal } = useSafeAreaSpacing();

  const { assignments } = course; 
  const {  removeAssignmentFromCourse, removeFileFromCourse, selectedFile, setSelectedFile} = useCourses();
  if(selectedCourse == null)return null
  const [isMenuVisible, setMenuVisible] = useState(false);
  const buttonRef = useRef(null);
  const navigation = useNavigation()

  return (
    
    <FlatList

      contentInsetAdjustmentBehavior="automatic"
      initialNumToRender={15}
      style={GlobalStyles.grow}
      contentContainerStyle={paddingHorizontal}
      data={assignments}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item: assign, index }) => (
        <CourseAssignmentsListItem 
          assignmentId={assign.id} title={assign.name} date={assign.date} student={assign.student}            
        />

      )}
      ListFooterComponent={<BottomBarSpacer />}
      ItemSeparatorComponent={() => <IndentedDivider  />}
      ListEmptyComponent={() => {
        if (assignments.length == 0) {
          return (
            <EmptyState
              icon={faInbox}
              message={'Notices empty'}
            />
          );
        }
    
      }}
    />
    
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Sfondo semitrasparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: 320, 
    minHeight: 180, 
    elevation: 5,
  },
  menuItem: {
    padding: 10,
    fontSize: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#000',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  removeButton: {
    backgroundColor: '#e53935',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

