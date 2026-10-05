import { useTranslation } from 'react-i18next';
import { Alert, Platform } from 'react-native';

import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { TeachingNavigatorID } from '@polito/lib/core';
import {
  HeaderLogoNoProps,
  IconButton,
  createHeaderCloseButton,
  useTheme,
  useTitlesStyles,
} from '@polito/lib/ui';
import { MenuView } from '@react-native-menu/menu';
import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import {
  AddStudentsScreen,
  EmailComposeScreen,
  NotifyComposeScreen,
  SelectContactMethodScreen,
  SelectStudentsScreen,
} from '../../features/students';
import { SpecialNeedsScreen } from '../../features/students/screens/SpecialNeedsScreen';
import { StudentContact } from '../../features/students/screens/StudentContact';
import { ExamScreen } from '../ExamScreen';
import { ExamScreen2 } from '../ExamScreen2';
import { ExamScreen3 } from '../ExamScreen3';
import { ExamsScreen } from '../ExamsScreen';
import { GradesScreen } from '../GradesScreen';
import { ContactScreen2 } from './ContactScreen2';
import {
  CourseSharedScreens,
  CourseSharedScreensParamList,
} from './CourseSharedScreens';
import { StaffScreen } from './CourseStaffScreen';
import { CoursesScreen } from './CoursesScreen';
import { FormScreen } from './FormScreen';
import { LectureFormScreen } from './LectureFormScreen';
import { LessonScreen } from './LessonScreen';
import { ModifyFileScreen } from './ModifyFileScreen';
import { ModifyLectureScreen } from './ModifyLectureScreen';
import { ModifyNoticeScreen } from './ModifyNoticeScreen';
import { NoticeFormScreen } from './NoticeFormScreen';
import { NoticeScreen } from './NoticeScreen';
import { TeachingScreen } from './TeachingScreen';

export { TeachingNavigatorID };

export type TeachingStackParamList = Omit<
  CourseSharedScreensParamList,
  'Course'
> & {
  Course: {
    id?: number;
    from?: string;
    animated?: boolean;
    title?: string;
    uniqueShortcode?: string;
  };
  Home: undefined;
  MyCourses: undefined;
  ExamsCalls: undefined;
  Exam: { id: number };
  Form: undefined;
  Roles: undefined;
  Notice: undefined;
  Lecture: undefined;
  Grades: undefined;
  ModifyNotice: undefined;
  ModifyFile: undefined;
  ModifyLecture: undefined;
  Staff: undefined;
  Exam3: undefined;
  Exam2: undefined;
  StudentContact: undefined;
  AddStudents: undefined;
  SelectStudents: { initialSelectAll?: boolean } | undefined;
  SelectContactMethod: { selectedIds: string[] };
  EmailCompose: { selectedIds: string[] };
  NotifyCompose: { selectedIds: string[] };
  SpecialNeeds: undefined;
  NoticeForm: undefined;
  LectureForm: undefined;
  Contatto: undefined;
};

const Stack = createNativeStackNavigator<
  TeachingStackParamList,
  typeof TeachingNavigatorID
>();

export const TeachingNavigator = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Stack.Navigator
      id={TeachingNavigatorID}
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: Platform.select({ ios: true }),
        headerLargeStyle: {
          backgroundColor: colors.background,
        },
        ...useTitlesStyles(theme),
      }}
    >
      <Stack.Screen
        name="Home"
        component={TeachingScreen}
        options={{
          headerLeft: HeaderLogoNoProps,
          headerTitle: t('teachingScreen.title'),
        }}
      />
      <Stack.Screen
        name="MyCourses"
        component={CoursesScreen}
        options={{
          headerTitle: t('other.myCourses'),
        }}
      />
      <Stack.Screen
        name="Notice"
        component={NoticeScreen}
        options={{
          headerTitle: t('common.notice'),
          headerLargeTitle: false,
          headerBackButtonDisplayMode: 'minimal',
          headerRight: () => <NoticeMenu />,
        }}
      />
      <Stack.Screen
        name="Lecture"
        component={LessonScreen}
        options={{
          headerTitle: t('common.lecture'),
          headerLargeTitle: false,
          headerBackButtonDisplayMode: 'minimal',
          headerRight: () => <LectureMenu />,
        }}
      />
      <Stack.Screen name="Form" component={FormScreen} />
      <Stack.Screen name="NoticeForm" component={NoticeFormScreen} />
      <Stack.Screen name="LectureForm" component={LectureFormScreen} />
      <Stack.Screen name="ModifyNotice" component={ModifyNoticeScreen} />
      <Stack.Screen name="ModifyFile" component={ModifyFileScreen} />
      <Stack.Screen name="ModifyLecture" component={ModifyLectureScreen} />
      <Stack.Screen
        name="StudentContact"
        component={StudentContact}
        options={{
          title: t('other.student'),
          headerLargeTitle: false,
          headerTransparent: false,
          headerBackButtonDisplayMode: 'minimal',
          presentation: 'card',
          animation: 'slide_from_right',
          fullScreenGestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="SpecialNeeds"
        component={SpecialNeedsScreen}
        options={{
          title: t('other.specialNeedsTitle'),
          headerLargeTitle: false,
          headerTransparent: false,
          headerBackButtonDisplayMode: 'minimal',
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
        }}
      />
      <Stack.Screen
        name="AddStudents"
        component={AddStudentsScreen}
        options={({ navigation }) => ({
          presentation: 'modal',
          headerShown: Platform.OS === 'android',
          headerLargeTitle: false,
          headerTransparent: false,
          title: t('other.addStudent'),
          headerLeft: () => null,
          headerRight:
            Platform.OS === 'android'
              ? () => null
              : createHeaderCloseButton(navigation),
        })}
      />
      <Stack.Screen
        name="SelectStudents"
        component={SelectStudentsScreen}
        options={({ navigation }) => ({
          presentation: 'modal',
          headerShown: Platform.OS === 'android',
          headerLargeTitle: false,
          headerTransparent: false,
          title: t('other.selectStudents'),
          headerLeft: () => null,
          headerRight:
            Platform.OS === 'android'
              ? () => null
              : createHeaderCloseButton(navigation),
        })}
      />
      <Stack.Screen
        name="SelectContactMethod"
        component={SelectContactMethodScreen}
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EmailCompose"
        component={EmailComposeScreen}
        options={({ navigation }) => ({
          presentation: 'modal',
          headerShown: Platform.OS === 'android',
          headerLargeTitle: false,
          headerTransparent: false,
          title: t('other.newEmail'),
          headerLeft: () => null,
          headerRight:
            Platform.OS === 'android'
              ? () => null
              : createHeaderCloseButton(navigation),
        })}
      />
      <Stack.Screen
        name="NotifyCompose"
        component={NotifyComposeScreen}
        options={({ navigation }) => ({
          presentation: 'modal',
          headerShown: Platform.OS === 'android',
          headerLargeTitle: false,
          headerTransparent: false,
          title: t('other.newNotify'),
          headerLeft: () => null,
          headerRight:
            Platform.OS === 'android'
              ? () => null
              : createHeaderCloseButton(navigation),
        })}
      />
      <Stack.Screen
        name="Staff"
        component={StaffScreen}
        options={{
          headerTitle: t('other.managingAccesses'),
          headerLargeTitle: false,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen
        name="ExamsCalls"
        component={ExamsScreen}
        options={{
          headerTitle: t('other.appeals'),
        }}
      />
      <Stack.Screen
        name="Exam"
        component={ExamScreen}
        getId={({ params }) => `${params.id}`}
        options={{
          headerLargeTitle: false,
          headerTitle: t('common.examCall'),
        }}
      />
      <Stack.Screen name="Exam2" component={ExamScreen2} />
      <Stack.Screen name="Exam3" component={ExamScreen3} />
      <Stack.Screen
        name="Grades"
        component={GradesScreen}
        options={{
          headerTitle: t('common.transcript'),
        }}
      />
      <Stack.Screen
        name="Contatto"
        component={ContactScreen2}
        options={{
          headerTitle: t('common.transcript'),
        }}
      />
      {CourseSharedScreens()}
    </Stack.Navigator>
  );
};

const NoticeMenu = () => {
  const { t } = useTranslation();
  const { palettes, fontSizes } = useTheme();
  const { selectedNotice, deleteNoticeFromCourse, selectedCourse } =
    useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  const handleDelete = () => {
    if (!selectedCourse || !selectedNotice) return;
    Alert.alert(t('other.confirm'), t('other.alertNotice2'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          deleteNoticeFromCourse(selectedCourse.id, selectedNotice.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <MenuView
      actions={[
        { id: 'modify', title: t('other.modify') },
        {
          id: 'delete',
          title: t('common.delete'),
          attributes: { destructive: true },
        },
      ]}
      onPressAction={({ nativeEvent }) => {
        if (
          nativeEvent.event === 'modify' &&
          selectedCourse &&
          selectedNotice
        ) {
          navigation.navigate('ModifyNotice');
        }
        if (nativeEvent.event === 'delete') {
          handleDelete();
        }
      }}
    >
      <IconButton
        icon={faEllipsisVertical}
        color={palettes.primary[400]}
        size={fontSizes.lg}
        adjustSpacing="right"
        accessibilityLabel={t('common.options')}
      />
    </MenuView>
  );
};

const LectureMenu = () => {
  const { t } = useTranslation();
  const { palettes, fontSizes } = useTheme();
  const { selectedLecture, deleteLessonFromCourse, selectedCourse } =
    useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  const handleDelete = () => {
    if (!selectedCourse || !selectedLecture) return;
    Alert.alert(
      t('other.confirm'),
      'Sei sicuro di voler eliminare questa lezione?',
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            deleteLessonFromCourse(selectedCourse.id, selectedLecture.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <MenuView
      actions={[
        { id: 'modify', title: t('other.modify') },
        {
          id: 'delete',
          title: t('common.delete'),
          attributes: { destructive: true },
        },
      ]}
      onPressAction={({ nativeEvent }) => {
        if (
          nativeEvent.event === 'modify' &&
          selectedCourse &&
          selectedLecture
        ) {
          navigation.navigate('ModifyLecture');
        }
        if (nativeEvent.event === 'delete') {
          handleDelete();
        }
      }}
    >
      <IconButton
        icon={faEllipsisVertical}
        color={palettes.primary[400]}
        size={fontSizes.lg}
        adjustSpacing="right"
        accessibilityLabel={t('common.options')}
      />
    </MenuView>
  );
};
