import { Fragment, useEffect } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
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
import { faChevronRight, faInbox } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export const CourseLecturesTab = () => {
  const { fakeCourses , setSelectedLecture} = useCourses();
  const { fontSizes, colors, spacing } = useTheme();
  
 const { selectedCourse } = useCourses()
  // Troviamo il corso corrispondente
  const course = selectedCourse;
  // Se il corso non esiste, restituiamo null
  if (!course) {
    return null;
  }
  const { paddingHorizontal } = useSafeAreaSpacing();

  const { lessons } = course; // Otteniamo le notifiche del corso
  const navigation = useNavigation();
  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      initialNumToRender={15}
      style={GlobalStyles.grow}
      contentContainerStyle={paddingHorizontal}
      data={lessons}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item: lesson, index }) => (
        <ListItem
          title={lesson.title}
          subtitle={`${lesson.date} - ${lesson.time}`}
          onPress={() => {
            setSelectedLecture(lesson)
            navigation.navigate('Lezione')
          } }
          trailingItem={
            <FontAwesomeIcon icon={faChevronRight}  size = {24}/>
          }
        />
      )}
      ListFooterComponent={<BottomBarSpacer />}
      ItemSeparatorComponent={() => <IndentedDivider  />}
      ListEmptyComponent={() => {
        if (!lessons || lessons.length === 0) {
          return (
            <EmptyState
              icon={faInbox}
              message={'Lectures empty'}
            />
          );
        }
    
      }}
    />
  );
};
