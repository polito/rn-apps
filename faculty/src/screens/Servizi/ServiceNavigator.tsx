import { Platform, TouchableOpacity } from 'react-native';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme, useTitlesStyles } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BookEventsForm } from './BookEventsForm';
import { BookEventsRoomScreen } from './BookEventsRoomScreen';
import { BookRoomForm } from './BookRoomForm';
import { BookRoomScreen } from './BookRoomScreen';
import { BookStructureForm } from './BookStructureForm';
import { BookStructureRoomScreen } from './BookStructureRoomScreen';
import { BookingScreen } from './BookingScreen';
import { ContactsScreen } from './ContactScreen';
import { DigitalSignatureScreen } from './DigitalSignatureScreen';
import { EmergencyDetails } from './EmergencyDetails';
import { EmergencyScreen } from './EmergencyScreen';
import { IssueDetails } from './IssueDetails';
import { IssueReport } from './IssueReport';
import { IssueReportForm } from './IssueReportForm';
import { PersoneScreen } from './PersoneScreen';
import { ServiceScreen } from './ServiceScreen';
import { SignatureScreen } from './SignatureScreen';
import { SingleBooking0 } from './SingleBooking0';
import { SingleBooking1 } from './SingleBooking1';
import { SingleBooking2 } from './SingleBooking2';
import { SupportScreen } from './SupportScreen';

export type ProfileStackParamList = {
  Servizi: undefined;
  Contatto: undefined;
  Persone: undefined;
  Supporto: undefined;
  Prenotazione: undefined;
  PrenotaSpaziStrutture: undefined;
  PrenotaAula: undefined;
  PrenotaSpaziEventi: undefined;
  PrenotaAulaForm: undefined;
  PrenotaEventiForm: undefined;
  PrenotaStruttureForm: undefined;
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
      style={{ paddingHorizontal: 10 }}
    >
      <FontAwesomeIcon icon={faArrowLeft} size={22} color="black" />
    </TouchableOpacity>
  );
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ServiceNavigator = () => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Stack.Navigator
      screenOptions={{
        headerLargeTitle: false,
        headerTransparent: Platform.select({ ios: false }),
        headerLargeStyle: {
          backgroundColor: colors.background,
        },
        ...useTitlesStyles(theme),
      }}
    >
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
        component={ContactsScreen}
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
        name="PrenotaAula"
        component={BookRoomScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="PrenotaSpaziEventi"
        component={BookEventsRoomScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="PrenotaSpaziStrutture"
        component={BookStructureRoomScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="PrenotaAulaForm"
        component={BookRoomForm}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="PrenotaEventiForm"
        component={BookEventsForm}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="PrenotaStruttureForm"
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
