import {useTranslation} from 'react-i18next';
import {
  Alert,
  Animated,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../../ui/hooks/useTheme';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CoursesScreen} from './CoursesScreen';
import {ExamScreen} from '../ExamScreen';
import {ExamsScreen} from '../ExamsScreen';
import {GradesScreen} from '../GradesScreen';
import {HomeScreen} from '../HomeScreen';
import {EmptyScreen} from '../EmptyScreen';
import React, { useRef, useState } from 'react';
import {TeachingScreen} from './TeachingScreen';
import TranslucentView from '../../core/components/TranslucentView';
import {getHeaderTitle} from '@react-navigation/elements';
import {Header} from '../../core/components/Header';
import {CourseGuideScreen} from './CourseGuideScreen';
import {Logo} from '../../core/components/Logo';
import {titlesStyles} from '../../core/hooks/titlesStyles';
import {useTitlesStyles} from '../../core/hooks/useTitleStyles';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft, faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import {NoticeScreen} from './NoticeScreen';
import {CourseNoticesTab} from './CourseNoticesTab';
import {CourseInfoTab} from './CourseInfoTab';
import {CourseNavigator} from './CourseNavigator';
import { FormScreen } from './FormScreen';
import Popover from 'react-native-popover-view';
import { Text } from '../../ui/components/Text';
import { useCourses } from '../../core/contexts/CoursesContext';
import { LessonScreen } from './LessonScreen';
import { ModifyNoticeScreen } from './ModifyNoticeScreen';
import { ModifyFileScreen } from './ModifyFileScreen';
import { ModifyLectureScreen } from './ModifyLectureScreen';
import { StaffScreen } from './StaffScreen';
import { ManagedCoursesScreen } from './ManagedCoursesScreen';
import { NoticeFormScreen } from './NoticeFormScreen';
import { FilesFormScreen } from './FilesFormScreen';
import { LectureFormScreen } from './LectureFormScreen';
import { ContactScreen2 } from './ContactScreen2';
import { ExamScreen3 } from '../ExamScreen3';
import { ExamScreen2 } from '../ExamScreen2';
import { StudentContact } from './StudentContact';

export type TeachingStackParamList = {
  Form : undefined;
  Incarichi: undefined;
  I_miei_corsi: undefined;
  Corsi_in_gestione : undefined;
  Avviso: undefined;
  Lezione : undefined;
  Notices: undefined;
  Info: undefined;
  Course: {from : string};
  CourseGuide: {courseId: number};
  CourseVideolecture: {courseId: number; lectureId: number};
  CourseVirtualClassroom: {courseId: number; lectureId: number};
  CourseAssignmentUpload: {courseId: number};
  Appelli: undefined;
  Exam: {id: number};
  Grades: undefined;
  CourseDirectory: undefined;
  CourseDirectoryRoot: undefined;
  ModifyNotice : undefined;
  ModifyFile : undefined;
  ModifyLecture : undefined;
  Staff : undefined;
  Exam3 : undefined; 
    Exam2: undefined; 
StudentContact : undefined;
  NoticeForm : undefined;
  FilesForm: undefined;
  LectureForm: undefined;
  StudentsForm: undefined;
  Contatto : undefined;
};
const CustomBackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Incarichi'); // Altrimenti torna alla schermata "Courses"
      }}
      style={{paddingHorizontal: 10}}>
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
      style={{paddingHorizontal: 10}}>
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};

const CustomBackButton3 = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Course'); // Altrimenti torna alla schermata "Courses"
      }}
      style={{paddingHorizontal: 10}}>
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};

const CustomBackButton4 = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Appelli'); // Altrimenti torna alla schermata "Courses"
      }}
      style={{paddingHorizontal: 10}}>
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};

const CustomBackButton5 = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('I_miei_corsi'); // Altrimenti torna alla schermata "Courses"
      }}
      style={{paddingHorizontal: 10}}>
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};


const CustomBackButton6 = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Corsi_in_gestione'); // Altrimenti torna alla schermata "Courses"
      }}
      style={{paddingHorizontal: 10}}>
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};


const CustomBackButton7 = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Agenda', {screen : 'SingleElement'}); // Altrimenti torna alla schermata "Courses"
      }}
      style={{paddingHorizontal: 10}}>
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


const HeaderLeftWithLogoAndBack2 = () => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <CustomBackButton4 />
      <Logo />
    </View>
  );
};





const Stack = createNativeStackNavigator<TeachingStackParamList>();

export const TeachingNavigator = () => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {colors} = theme;

  

  return (
    <Stack.Navigator
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: Platform.select({ios: false}),
        headerLargeStyle: {
          backgroundColor: colors.background,
        },
        ...useTitlesStyles(theme),
      }}>
     <Stack.Screen
  name="Incarichi"
  component={TeachingScreen}
  options={{
    headerLeft: () => <Logo />,
    headerTitle: () => (
      <Text variant="heading" style={{ textAlign: 'center', width: '100%', marginLeft : -15 }}>
        {t('teachingScreen.title')}
      </Text>
    ),
    headerRight: () => <View style={{ width: 40 }} />, // bilancia lo spazio del logo
  }}
/>
      <Stack.Screen
        name="I_miei_corsi"
        component={CoursesScreen}
        options={{
        headerLeft: () => <HeaderLeftWithLogoAndBack />,

          headerTitle: () => (
            <Text variant="heading" style={{ textAlign: 'center', width: '100%', marginLeft : -40 }}>
              {t('other.myCourses')}
            </Text>
          ),
          headerRight: () => <View style={{ width: 40 }} />,
        }}
      />

      <Stack.Screen
        name="Corsi_in_gestione"
        component={ManagedCoursesScreen}
        options={{
        headerLeft: () => <HeaderLeftWithLogoAndBack />,

          headerTitle: () => (
            <Text variant="heading" style={{ textAlign: 'center', width: '100%', marginLeft : -30 }}>
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

    let headerLeftButton;
    if (from === 'I_miei_corsi') {
      headerLeftButton = <CustomBackButton5 />;
    } else if (from === 'Corsi_in_gestione') {
      headerLeftButton = <CustomBackButton6 />;
    }else if (from === 'Agenda'){
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
            <Text variant="heading" style={{ textAlign: 'center', width: '100%', marginLeft : -10 }}>
              {t('common.notice')}
            </Text>
          ),
          headerRight : () => <NoticeMenu ></NoticeMenu>,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Lezione"
        component={LessonScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerRight : () => <LectureMenu ></LectureMenu>,
          headerTitle: () => (
            <Text variant="heading" style={{ textAlign: 'center', width: '100%', marginLeft : -10 }}>
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

      <Stack.Screen
        name="StudentContact"
        component={StudentContact}
        
      />


      <Stack.Screen
        name="Staff"
        component={StaffScreen}
        options={{
          headerTitle: () => (
            <Text variant="heading" style={{ textAlign: 'center', width: '100%', marginLeft : -20 }}>
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
            <Text variant="heading" style={{ textAlign: 'center', width: '100%', marginLeft : -35 }}>
              {t('other.appeals')}
            </Text>
          ),
          headerRight: () => <View style={{ width: 40 }} />,
        }}
      />
      <Stack.Screen
       name="Exam" 
       component={ExamScreen} 
       
       />

        <Stack.Screen
       name="Exam2" 
       component={ExamScreen2} 
       
       />

      <Stack.Screen
       name="Exam3" 
       component={ExamScreen3} 
       
       />


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
  const {selectedNotice, updateCourseNotice, deleteNoticeFromCourse, selectedCourse} = useCourses()
  const navigation = useNavigation()
  const  {t} = useTranslation()
const handleDelete = () => {
  if (selectedCourse && selectedNotice) {
    Alert.alert(
      t('other.confirm'),
      t('other.alertNotice2'),
      [
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
      ]
    );
  }
};

  
  const handleUpdate = () => {
    if (selectedCourse && selectedNotice) {
      console.log("updated")
      navigation.navigate('ModifyNotice')
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
        from={buttonRef}
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
  const {selectedLecture, deleteLessonFromCourse, selectedCourse} = useCourses()
  const navigation = useNavigation()

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
      ]
    );
  }
};

const handleUpdate = () => {
    if(selectedCourse && selectedLecture){
      navigation.navigate('ModifyLecture');
    setMenuVisible(false);
    }
    
  }

  return (
    <View>
      {/* Pulsante con tre puntini */}
      <TouchableOpacity ref={buttonRef} onPress={() => setMenuVisible(true)}>
        <FontAwesomeIcon icon={faEllipsisV} size={24} />
      </TouchableOpacity>

      {/* Popover che si apre sotto i tre puntini */}
      <Popover
        isVisible={isMenuVisible}
        from={buttonRef}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity onPress={handleUpdate}>
          <Text style={styles.menuItem}>Modifica</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.menuItem}>Elimina</Text>
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

