import {useTranslation} from 'react-i18next';
import {
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
import {ExamScreen} from '../ExamScreen';
import {ExamsScreen} from '../ExamsScreen';
import {GradesScreen} from '../GradesScreen';
import {HomeScreen} from '../HomeScreen';
import {EmptyScreen} from '../EmptyScreen';
import React, {useRef, useState} from 'react';
import TranslucentView from '../../core/components/TranslucentView';
import {getHeaderTitle} from '@react-navigation/elements';
import {Header} from '../../core/components/Header';
import {Logo} from '../../core/components/Logo';
import {titlesStyles} from '../../core/hooks/titlesStyles';
import {useTitlesStyles} from '../../core/hooks/useTitleStyles';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faBell,
  faEllipsisV,
  faPenToSquare,
  faSliders,
} from '@fortawesome/free-solid-svg-icons';
import Popover from 'react-native-popover-view';
import {Text} from '../../ui/components/Text';
import {useCourses} from '../../core/contexts/CoursesContext';
import {IconButton} from '../../ui/components/IconButton';
import {Row} from '../../ui/components/Row';
import {ServiceScreen} from './ServiceScreen';
import {PersoneScreen} from './PersoneScreen';
import {ContactScreen} from './ContactScreen';
import {SupportScreen} from './SupportScreen';
import {BookingScreen} from './BookingScreen';
import {BookRoomScreen} from './BookRoomScreen';
import {BookEventsRoomScreen} from './BookEventsRoomScreen';
import {BookStructureRoomScreen} from './BookStructureRoomScreen';
import {BookRoomForm} from './BookRoomForm';
import {BookEventsForm} from './BookEventsForm';
import {BookStructureForm} from './BookStructureForm';
import {DigitalSignatureScreen} from './DigitalSignatureScreen';
import {SingleBooking0} from './SingleBooking0';
import {SingleBooking1} from './SingleBooking1';
import {SingleBooking2} from './SingleBooking2';
import {SignatureScreen} from './SignatureScreen';
import {EmergencyScreen} from './EmergencyScreen';
import {EmergencyDetails} from './EmergencyDetails';
import {IssueReport} from './IssueReport';
import {IssueDetails} from './IssueDetails';
import {IssueReportForm} from './IssueReportForm';

export type ProfileStackParamList = {
  Servizi: undefined;
  Contatto: undefined;
  Persone: undefined;
  Supporto: undefined;
  Prenotazione: undefined;
  Prenota_spaziStrutture: undefined;
  Prenota_aula: undefined;
  Prenota_spaziEventi: undefined;
  Prenota_aulaForm: undefined;
  Prenota_eventiForm: undefined;
  Prenota_struttureForm: undefined;
  DigitalSignature: undefined;
  Booking0: undefined;
  Booking1: undefined;
  Booking2: undefined;
  SignatureScreen: undefined;
  Emergency: undefined;
  EmergencyDetails: undefined;
  IssueReport: undefined;
  IssueDetails: undefined;
  IssueReportForm: undefined;
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

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ServiceNavigator = () => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {colors, fontSizes, spacing} = theme;
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerLargeTitle: false,
        headerTransparent: Platform.select({ios: false}),
        headerLargeStyle: {
          backgroundColor: colors.background,
        },
        ...useTitlesStyles(theme),
      }}>
      <Stack.Screen name="Servizi" component={ServiceScreen} />
      <Stack.Screen
        name="Persone"
        component={PersoneScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Contatto"
        component={ContactScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Supporto"
        component={SupportScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Prenotazione"
        component={BookingScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Prenota_aula"
        component={BookRoomScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Prenota_spaziEventi"
        component={BookEventsRoomScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Prenota_spaziStrutture"
        component={BookStructureRoomScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Prenota_aulaForm"
        component={BookRoomForm}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Prenota_eventiForm"
        component={BookEventsForm}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Prenota_struttureForm"
        component={BookStructureForm}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="DigitalSignature"
        component={DigitalSignatureScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Booking0"
        component={SingleBooking0}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Booking1"
        component={SingleBooking1}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Booking2"
        component={SingleBooking2}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="SignatureScreen"
        component={SignatureScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="EmergencyDetails"
        component={EmergencyDetails}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="IssueReport"
        component={IssueReport}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="IssueDetails"
        component={IssueDetails}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="IssueReportForm"
        component={IssueReportForm}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    padding: 10,
    fontSize: 16,
  },
});
