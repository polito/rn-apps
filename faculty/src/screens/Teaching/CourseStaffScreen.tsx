import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

import { faInbox, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  CtaButton,
  EmptyState,
  GlobalStyles,
  IndentedDivider,
  useSafeAreaSpacing,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { CourseSharedScreensParamList } from './CourseSharedScreens';
import { StaffListItem } from './StaffListItem';

export const StaffScreen = () => {
  const { selectedCourse } = useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<CourseSharedScreensParamList>>();
  const course = selectedCourse;

  const { paddingHorizontal } = useSafeAreaSpacing();

  const { t } = useTranslation();

  if (!course) {
    return null;
  }
  const { staff: staffData } = course; // Otteniamo le notifiche del corso

  return (
    <>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        initialNumToRender={15}
        style={GlobalStyles.grow}
        contentContainerStyle={paddingHorizontal}
        data={staffData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item: staff }) => <StaffListItem staff={staff} />}
        ListFooterComponent={<BottomBarSpacer />}
        ItemSeparatorComponent={() => <IndentedDivider />}
        ListEmptyComponent={() => {
          if (!staffData || staffData.length === 0) {
            return <EmptyState icon={faInbox} message="Lectures empty" />;
          }
          return null;
        }}
      />
      <CtaButton
        title={t('other.addCollaborator')}
        action={() => {
          navigation.navigate('AddStaff', { from: 'staffScreen' });
        }}
        icon={faPlus}
        absolute={false}
        variant="filled"
      />
    </>
  );
};
