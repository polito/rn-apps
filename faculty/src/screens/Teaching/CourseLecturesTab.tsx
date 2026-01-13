import { FlatList } from 'react-native';

import { faChevronRight, faInbox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BottomBarSpacer } from '../../core/components/BottomBarSpacer';
import { GlobalStyles } from '../../core/components/GlobalStyles';
import { useCourses } from '../../core/contexts/CoursesContext';
import { useSafeAreaSpacing } from '../../core/hooks/useSafeAreaSpacing';
import { EmptyState } from '../../ui/components/EmptyState';
import { IndentedDivider } from '../../ui/components/IndentedDivider';
import { ListItem } from '../../ui/components/ListItem';
import { TeachingStackParamList } from './TeachingNavigator';

export const CourseLecturesTab = () => {
  const { setSelectedLecture } = useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  const { paddingHorizontal } = useSafeAreaSpacing();

  const { selectedCourse } = useCourses();
  // Troviamo il corso corrispondente
  const course = selectedCourse;
  // Se il corso non esiste, restituiamo null
  if (!course) {
    return null;
  }

  const { lessons } = course; // Otteniamo le notifiche del corso

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      initialNumToRender={15}
      style={GlobalStyles.grow}
      contentContainerStyle={paddingHorizontal}
      data={lessons}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item: lesson }) => (
        <ListItem
          title={lesson.title}
          subtitle={`${lesson.date} - ${lesson.time}`}
          onPress={() => {
            setSelectedLecture(lesson);
            navigation.navigate('Lezione');
          }}
          trailingItem={<FontAwesomeIcon icon={faChevronRight} size={24} />}
        />
      )}
      ListFooterComponent={<BottomBarSpacer />}
      ItemSeparatorComponent={() => <IndentedDivider />}
      ListEmptyComponent={() => {
        if (!lessons || lessons.length === 0) {
          return <EmptyState icon={faInbox} message="Lectures empty" />;
        }
        return null;
      }}
    />
  );
};
