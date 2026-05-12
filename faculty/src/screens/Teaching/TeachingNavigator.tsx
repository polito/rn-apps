import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Popover from 'react-native-popover-view';

import { faArrowLeft, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  HeaderLogoNoProps,
  Text,
  useTheme,
  useTitlesStyles,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import {
  AddStudentsScreen,
  SelectStudentsScreen,
  StudentExamsScreen,
} from '../../features/students';
import { SpecialNeedsScreen } from '../../features/students/screens/SpecialNeedsScreen';
import { StudentContact } from '../../features/students/screens/StudentContact';
import { ExamScreen } from '../ExamScreen';
import { ExamScreen2 } from '../ExamScreen2';
import { ExamScreen3 } from '../ExamScreen3';
import { ExamsScreen } from '../ExamsScreen';
import { GradesScreen } from '../GradesScreen';
import { ContactScreen2 } from './ContactScreen2';
import { CourseGuideScreen } from './CourseGuideScreen';
import { CourseSharedScreens } from './CourseSharedScreens';
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

export type TeachingStackParamList = {
  Home: undefined;
  MyCourses: undefined;
  ExamsCalls: undefined;
  Exam: { id: number };

  Form: undefined;
  Roles: undefined;
  Notice: undefined;
  Lecture: undefined;
  Notices: undefined;
  Info: undefined;
  Course: { from?: string };
  CourseGuide: { courseId: number };
  CourseVideolecture: { courseId: number; lectureId: number };
  CourseVirtualClassroom: { courseId: number; lectureId: number };
  CourseAssignmentUpload: { courseId: number };

  Grades: undefined;
  CourseDirectory: undefined;
  CourseFileMultiSelectScreen: {
    courseId: number;
    path?: string;
    action?: 'move' | 'delete';
    initialSelectedIds?: string[];
  };
  CourseFilesUploadScreen: { courseId: number; path?: string };
  CourseDirectoryRoot: undefined;
  ModifyNotice: undefined;
  ModifyFile: undefined;
  ModifyLecture: undefined;
  Staff: undefined;
  Exam3: undefined;
  Exam2: undefined;
  StudentContact: undefined;
  AddStudents: undefined;
  SelectStudents: { initialSelectAll?: boolean } | undefined;
  SpecialNeeds: undefined;
  StudentExams: undefined;
  NoticeForm: undefined;
  LectureForm: undefined;
  StudentsForm: undefined;
  Contatto: undefined;
};

export const CustomBackButton = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Home');
      }}
      style={{ paddingHorizontal: 10 }}
    >
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};

export const TeachingNavigatorID = 'TeachingTabNavigator';

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
          headerLeft: () => {
            return (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CustomBackButton />
              </View>
            );
          },
          headerTitle: t('other.myCourses'),
        }}
      />

      <Stack.Screen
        name="Notice"
        component={NoticeScreen}
        options={{
          headerTitle: () => (
            <Text
              variant="heading"
              style={{ textAlign: 'center', width: '100%', marginLeft: -10 }}
            >
              {t('common.notice')}
            </Text>
          ),
          headerRight: () => <NoticeMenu />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Lecture"
        component={LessonScreen}
        options={{
          headerRight: () => <LectureMenu />,
          headerTitle: () => (
            <Text
              variant="heading"
              style={{ textAlign: 'center', width: '100%', marginLeft: -10 }}
            >
              {t('common.lecture')}
            </Text>
          ),
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Form"
        component={FormScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="NoticeForm"
        component={NoticeFormScreen}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="LectureForm"
        component={LectureFormScreen}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="ModifyNotice"
        component={ModifyNoticeScreen}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="ModifyFile"
        component={ModifyFileScreen}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="ModifyLecture"
        component={ModifyLectureScreen}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="StudentContact"
        component={StudentContact}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
          fullScreenGestureEnabled: true,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SpecialNeeds"
        component={SpecialNeedsScreen}
        options={{
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AddStudents"
        component={AddStudentsScreen}
        options={{
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SelectStudents"
        component={SelectStudentsScreen}
        options={{
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="StudentExams"
        component={StudentExamsScreen}
        options={{
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Staff"
        component={StaffScreen}
        options={{
          headerTitle: () => (
            <Text
              variant="heading"
              style={{ textAlign: 'center', width: '100%', marginLeft: -20 }}
            >
              {t('other.managingAccesses')}
            </Text>
          ),
          headerShown: true,
        }}
      />

      <Stack.Screen name="CourseGuide" component={CourseGuideScreen} />

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
          headerTitle: t('Transcript'),
        }}
      />
      <Stack.Screen
        name="Contatto"
        component={ContactScreen2}
        options={{
          headerTitle: t('Transcript'),
        }}
      />

      {CourseSharedScreens()}
    </Stack.Navigator>
  );
};

const NoticeMenu = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const buttonRef = useRef(null); // Riferimento ai tre puntini
  const { selectedNotice, deleteNoticeFromCourse, selectedCourse } =
    useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  const { t } = useTranslation();
  const handleDelete = () => {
    if (selectedCourse && selectedNotice) {
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
            setMenuVisible(false);
          },
        },
      ]);
    }
  };

  const handleUpdate = () => {
    if (selectedCourse && selectedNotice) {
      navigation.navigate('ModifyNotice');
      setMenuVisible(false);
    }
  };

  return (
    <View>
      {/* Pulsante con tre puntini */}
      <TouchableOpacity ref={buttonRef} onPress={() => setMenuVisible(true)}>
        <FontAwesomeIcon icon={faEllipsisV} size={24} />
      </TouchableOpacity>

      {/* Popover che si apre sotto i tre puntini */}
      <Popover
        isVisible={isMenuVisible}
        from={buttonRef.current}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity onPress={handleUpdate}>
          <Text style={styles.menuItem}>{t('other.modify')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.menuItem}>{t('other.delete')}</Text>
        </TouchableOpacity>
      </Popover>
    </View>
  );
};

const LectureMenu = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const buttonRef = useRef(null); // Riferimento ai tre puntini
  const { t } = useTranslation();
  const { selectedLecture, deleteLessonFromCourse, selectedCourse } =
    useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  const handleDelete = () => {
    if (selectedCourse && selectedLecture) {
      Alert.alert(
        'Conferma eliminazione',
        'Sei sicuro di voler eliminare questa lezione?',
        [
          {
            text: 'Annulla',
            style: 'cancel',
          },
          {
            text: 'Conferma',
            style: 'destructive',
            onPress: () => {
              deleteLessonFromCourse(selectedCourse.id, selectedLecture.id);
              navigation.goBack();
              setMenuVisible(false);
            },
          },
        ],
      );
    }
  };

  const handleUpdate = () => {
    if (selectedCourse && selectedLecture) {
      navigation.navigate('ModifyLecture');
      setMenuVisible(false);
    }
  };

  return (
    <View>
      {/* Pulsante con tre puntini */}
      <TouchableOpacity ref={buttonRef} onPress={() => setMenuVisible(true)}>
        <FontAwesomeIcon icon={faEllipsisV} size={24} />
      </TouchableOpacity>

      {/* Popover che si apre sotto i tre puntini */}
      <Popover
        isVisible={isMenuVisible}
        from={buttonRef.current}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity onPress={handleUpdate}>
          <Text style={styles.menuItem}>{t('other.modify')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.menuItem}>{t('other.delete')}</Text>
        </TouchableOpacity>
      </Popover>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    padding: 10,
    fontSize: 16,
  },
});
