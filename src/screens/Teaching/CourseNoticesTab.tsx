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
import { faChevronCircleRight, faChevronRight, faInbox } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export const CourseNoticesTab = () => {
  const { selectedCourse, selectedNotice, setSelectedNotice } = useCourses();
  const { fontSizes, colors, spacing } = useTheme();
    const navigation = useNavigation();
  
  // Troviamo il corso corrispondente
  const course = selectedCourse;

  // Se il corso non esiste, restituiamo null
  if (!course) {
    return null;
  }
  const { paddingHorizontal } = useSafeAreaSpacing();

  const { notices } = course; // Otteniamo le notifiche del corso
  
  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      initialNumToRender={15}
      style={GlobalStyles.grow}
      contentContainerStyle={paddingHorizontal}
      data={notices}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item: notice, index }) => (
        <ListItem
          title={notice.content}
          subtitle={notice.startDate}
          onPress={() =>{
            console.log(selectedCourse.notices)
            setSelectedNotice(notice)
            navigation.navigate("Avviso") 
          } }
          trailingItem={<FontAwesomeIcon icon={faChevronRight}  size = {24}/>}
        />
      )}
      ListFooterComponent={<BottomBarSpacer />}
      ItemSeparatorComponent={() => <IndentedDivider  />}
      ListEmptyComponent={() => {
        if (notices.length == 0) {
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
