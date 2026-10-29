import { createContext, memo, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { TeachingNavigatorID } from '@polito/lib/core';
import {
  createHeaderCloseButton,
  useTheme,
  useTitlesStyles,
} from '@polito/lib/ui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
import { AssignmentScreen } from './AssignmentScreen';
import { ContactScreen2 } from './ContactScreen2';
import {
  CourseSharedScreens,
  CourseSharedScreensParamList,
} from './CourseSharedScreens';
import { StaffScreen } from './CourseStaffScreen';
import { CoursesScreen } from './CoursesScreen';
import { FilesFormScreen } from './FilesFormScreen';
import { FormScreen } from './FormScreen';
import { LectureFormScreen } from './LectureFormScreen';
import { ManagedCoursesScreen } from './ManagedCoursesScreen';
import { ModifyFileScreen } from './ModifyFileScreen';
import { ModifyLectureScreen } from './ModifyLectureScreen';
import { ModifyNoticeScreen } from './ModifyNoticeScreen';
import { NoticeFormScreen } from './NoticeFormScreen';
import { TeachingAppBar } from './TeachingAppBar';
import { TeachingScreen } from './TeachingScreen';

export { TeachingNavigatorID };

export const TeachingScrollContext = createContext({
  isScrolled: false,
  setIsScrolled: (_: boolean) => {},
});

export const useTeachingScroll = () => useContext(TeachingScrollContext);

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
  ManagedCourses: undefined;
  ExamsCalls: undefined;
  Exam: { id: number };
  Form: undefined;
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
  FilesForm: undefined;
  LectureForm: undefined;
  Contatto: undefined;
  Assignment: { assignmentId: number };
};

const Stack = createNativeStackNavigator<
  TeachingStackParamList,
  typeof TeachingNavigatorID
>();

const HomeHeader = () => <TeachingAppBar />;

const TeachingNavigatorStack = memo(() => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack.Navigator
      id={TeachingNavigatorID}
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: Platform.select({ ios: true }),
        headerLargeStyle: {
          backgroundColor: 'transparent',
        },
        ...useTitlesStyles(theme),
      }}
    >
      <Stack.Screen
        name="Home"
        component={TeachingScreen}
        options={{
          headerLargeTitle: false,
          header: HomeHeader,
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
        name="ManagedCourses"
        component={ManagedCoursesScreen}
        options={{
          headerTitle: t('other.managedCourses'),
        }}
      />
      <Stack.Screen name="Form" component={FormScreen} />
      <Stack.Screen name="NoticeForm" component={NoticeFormScreen} />
      <Stack.Screen name="FilesForm" component={FilesFormScreen} />
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
          headerTitleAlign: 'center',
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
          headerTitleAlign: 'center',
          title: t('other.newNotify'),
          headerLeft: () => null,
          headerRight:
            Platform.OS === 'android'
              ? () => null
              : createHeaderCloseButton(navigation),
        })}
      />
      <Stack.Screen
        name="Assignment"
        component={AssignmentScreen}
        options={{ headerTitle: t('courseAssignmentsTab.title') }}
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
});

export const TeachingNavigator = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  return (
    <TeachingScrollContext.Provider value={{ isScrolled, setIsScrolled }}>
      <TeachingNavigatorStack />
    </TeachingScrollContext.Provider>
  );
};
