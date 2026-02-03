import { FlatList } from 'react-native';

import { faChevronRight, faInbox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  BottomBarSpacer,
  EmptyState,
  GlobalStyles,
  IndentedDivider,
  ListItem,
} from '@polito/lib';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { useSafeAreaSpacing } from '../../core/hooks/useSafeAreaSpacing';
import { TeachingStackParamList } from './TeachingNavigator';

export const CourseNoticesTab = () => {
  const { selectedCourse, setSelectedNotice } = useCourses();
  const { paddingHorizontal } = useSafeAreaSpacing();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  // Troviamo il corso corrispondente
  const course = selectedCourse;

  // Se il corso non esiste, restituiamo null
  if (!course) {
    return null;
  }

  const { notices } = course; // Otteniamo le notifiche del corso

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      initialNumToRender={15}
      style={GlobalStyles.grow}
      contentContainerStyle={paddingHorizontal}
      data={notices}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item: notice }) => (
        <ListItem
          title={notice.content}
          subtitle={notice.startDate}
          onPress={() => {
            setSelectedNotice(notice);
            navigation.navigate('Avviso');
          }}
          trailingItem={<FontAwesomeIcon icon={faChevronRight} size={24} />}
        />
      )}
      ListFooterComponent={<BottomBarSpacer />}
      ItemSeparatorComponent={() => <IndentedDivider />}
      ListEmptyComponent={() => {
        if (notices.length === 0) {
          return <EmptyState icon={faInbox} message="Notices empty" />;
        }
        return null;
      }}
    />
  );
};
