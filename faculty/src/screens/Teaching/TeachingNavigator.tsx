import { JSX, useRef, useState } from 'react';
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
import { Text } from '@polito/lib';
import { useTheme } from '@polito/lib';
import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { Logo } from '../../core/components/Logo';
import { useCourses } from '../../core/contexts/CoursesContext';
import { useTitlesStyles } from '../../core/hooks/useTitleStyles';
import { AgendaStackParamList } from '../Agenda/AgendaNavigator';
import { ExamScreen } from '../ExamScreen';
import { ExamScreen2 } from '../ExamScreen2';
import { ExamScreen3 } from '../ExamScreen3';
import { ExamsScreen } from '../ExamsScreen';
import { GradesScreen } from '../GradesScreen';
import { ContactScreen2 } from './ContactScreen2';
import { CourseGuideScreen } from './CourseGuideScreen';
import { CourseNavigator } from './CourseNavigator';
import { CoursesScreen } from './CoursesScreen';
import { FilesFormScreen } from './FilesFormScreen';
import { FormScreen } from './FormScreen';
import { LectureFormScreen } from './LectureFormScreen';
import { LessonScreen } from './LessonScreen';
import { ManagedCoursesScreen } from './ManagedCoursesScreen';
import { ModifyFileScreen } from './ModifyFileScreen';
import { ModifyLectureScreen } from './ModifyLectureScreen';
import { ModifyNoticeScreen } from './ModifyNoticeScreen';
import { NoticeFormScreen } from './NoticeFormScreen';
import { NoticeScreen } from './NoticeScreen';
import { StaffScreen } from './StaffScreen';
import { StudentContact } from './StudentContact';
import { TeachingScreen } from './TeachingScreen';

export type TeachingStackParamList = {
  Form: undefined;
  Incarichi: undefined;
  IMieiCorsi: undefined;
  CorsiInGestione: undefined;
  Avviso: undefined;
  Lezione: undefined;
  Notices: undefined;
  Info: undefined;
  Course: { from?: string };
  CourseGuide: { courseId: number };
  CourseVideolecture: { courseId: number; lectureId: number };
  CourseVirtualClassroom: { courseId: number; lectureId: number };
  CourseAssignmentUpload: { courseId: number };
  Appelli: undefined;
  Exam: { id: number };
  Grades: undefined;
  CourseDirectory: undefined;
  CourseDirectoryRoot: undefined;
  ModifyNotice: undefined;
  ModifyFile: undefined;
  ModifyLecture: undefined;
  Staff: undefined;
  Exam3: undefined;
  Exam2: undefined;
  StudentContact: undefined;
  NoticeForm: undefined;
  FilesForm: undefined;
  LectureForm: undefined;
  StudentsForm: undefined;
  Contatto: undefined;
};
const CustomBackButton = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Incarichi'); // Altrimenti torna alla schermata "Courses"
      }}
      style={{ paddingHorizontal: 10 }}
    >
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};

const CustomBackButton2 = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack(); // Altrimenti torna alla schermata "Courses"
      }}
      style={{ paddingHorizontal: 10 }}
    >
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};

const CustomBackButton3 = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Course', { from: undefined }); // Altrimenti torna alla schermata "Courses"
      }}
      style={{ paddingHorizontal: 10 }}
    >
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};

const CustomBackButton5 = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('IMieiCorsi'); // Altrimenti torna alla schermata "Courses"
      }}
      style={{ paddingHorizontal: 10 }}
    >
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};

const CustomBackButton6 = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('CorsiInGestione'); // Altrimenti torna alla schermata "Courses"
      }}
      style={{ paddingHorizontal: 10 }}
    >
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};

const CustomBackButton7 = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AgendaStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('SingleElement'); // Altrimenti torna alla schermata "Courses"
      }}
      style={{ paddingHorizontal: 10 }}
    >
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};

const HeaderLeftWithLogoAndBack = () => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <CustomBackButton />
      <Logo />
    </View>
  );
};

const Stack = createNativeStackNavigator<TeachingStackParamList>();

export const TeachingNavigator = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Stack.Navigator
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: Platform.select({ ios: false }),
        headerLargeStyle: {
          backgroundColor: colors.background,
        },
        ...useTitlesStyles(theme),
      }}
    >
      <Stack.Screen
        name="Incarichi"
        component={TeachingScreen}
        options={{
          headerLeft: () => <Logo />,
          headerTitle: () => (
            <Text
              variant="heading"
              style={{ textAlign: 'center', width: '100%', marginLeft: -15 }}
            >
              {t('teachingScreen.title')}
            </Text>
          ),
          headerRight: () => <View style={{ width: 40 }} />, // bilancia lo spazio del logo
        }}
      />
      <Stack.Screen
        name="IMieiCorsi"
        component={CoursesScreen}
        options={{
          headerLeft: () => <HeaderLeftWithLogoAndBack />,

          headerTitle: () => (
            <Text
              variant="heading"
              style={{ textAlign: 'center', width: '100%', marginLeft: -40 }}
            >
              {t('other.myCourses')}
            </Text>
          ),
          headerRight: () => <View style={{ width: 40 }} />,
        }}
      />

      <Stack.Screen
        name="CorsiInGestione"
        component={ManagedCoursesScreen}
        options={{
          headerLeft: () => <HeaderLeftWithLogoAndBack />,

          headerTitle: () => (
            <Text
              variant="heading"
              style={{ textAlign: 'center', width: '100%', marginLeft: -30 }}
            >
              {t('other.managedCourses')}
            </Text>
          ),
          headerRight: () => <View style={{ width: 40 }} />,
        }}
      />

      <Stack.Screen
        name="Course"
        component={CourseNavigator}
        options={({ route }) => {
          const from = route.params?.from;

          let headerLeftButton: JSX.Element;
          if (from === 'IMieiCorsi') {
            headerLeftButton = <CustomBackButton5 />;
          } else if (from === 'CorsiInGestione') {
            headerLeftButton = <CustomBackButton6 />;
          } else if (from === 'Agenda') {
            headerLeftButton = <CustomBackButton7 />;
          } else {
            // Default or 'Incarichi'
            headerLeftButton = <CustomBackButton />;
          }

          return {
            headerLeft: () => headerLeftButton,
            headerShown: true,
            headerLargeTitle: false,
          };
        }}
      />

      <Stack.Screen
        name="Avviso"
        component={NoticeScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
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
        name="Lezione"
        component={LessonScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
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
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="NoticeForm"
        component={NoticeFormScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="FilesForm"
        component={FilesFormScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="LectureForm"
        component={LectureFormScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="ModifyNotice"
        component={ModifyNoticeScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="ModifyFile"
        component={ModifyFileScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="ModifyLecture"
        component={ModifyLectureScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen name="StudentContact" component={StudentContact} />

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
          headerLeft: () => <CustomBackButton3 />,
          headerShown: true,
        }}
      />

      <Stack.Screen name="CourseGuide" component={CourseGuideScreen} />

      <Stack.Screen
        name="Appelli"
        component={ExamsScreen}
        options={{
          headerLeft: () => <HeaderLeftWithLogoAndBack />,

          headerTitle: () => (
            <Text
              variant="heading"
              style={{ textAlign: 'center', width: '100%', marginLeft: -35 }}
            >
              {t('other.appeals')}
            </Text>
          ),
          headerRight: () => <View style={{ width: 40 }} />,
        }}
      />
      <Stack.Screen name="Exam" component={ExamScreen} />

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
