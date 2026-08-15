import { Platform, TouchableOpacity } from 'react-native';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme, useTitlesStyles } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BookRoomScreen } from '../../features/bookings/screens/BookRoomScreen';
import { BookingRequestsScreen } from '../../features/bookings/screens/BookingRequestsScreen';
import { BookingScreen } from '../../features/bookings/screens/BookingScreen';
import { FacilitySpaceCalendarScreen } from '../../features/bookings/screens/FacilitySpaceCalendarScreen';
import { FacilitySpaceTimelineScreen } from '../../features/bookings/screens/FacilitySpaceTimelineScreen';
import { NewFacilityBookingScreen } from '../../features/bookings/screens/NewFacilityBookingScreen';
import { NewReservationScreen } from '../../features/bookings/screens/NewReservationScreen';
import { RequestDetailsScreen } from '../../features/bookings/screens/RequestDetailsScreen';
import { RequestSpaceScreen } from '../../features/bookings/screens/RequestSpaceScreen';
import { ContactScreen } from './ContactScreen';
import { DigitalSignatureScreen } from './DigitalSignatureScreen';
import { EmergencyDetails } from './EmergencyDetails';
import { EmergencyScreen } from './EmergencyScreen';
import { IssueDetails } from './IssueDetails';
import { IssueReport } from './IssueReport';
import { IssueReportForm } from './IssueReportForm';
import { PersoneScreen } from './PersoneScreen';
import { ServiceScreen } from './ServiceScreen';
import { SignatureScreen } from './SignatureScreen';
import { SupportScreen } from './SupportScreen';

export type ProfileStackParamList = {
  Servizi: undefined;
  Contatto: undefined;
  Persone: undefined;
  Supporto: undefined;
  Prenotazione: undefined;
  NuovaPrenotazione: undefined;
  RichiediSpazio: undefined;
  CalendarioSpaziStrutture: undefined;
  VistaCalendarioSpazio: { spaceId: string };
  NuovaPrenotazioneSpazio: { spaceId: string; eventId?: string } | undefined;
  PrenotaSpaziStrutture: undefined;
  PrenotaSpaziEventi: undefined;
  PrenotaAulaForm: undefined;
  DigitalSignature: undefined;
  RequestDetails: undefined;
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
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="NuovaPrenotazione"
        component={NewReservationScreen}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="RichiediSpazio"
        component={RequestSpaceScreen}
        options={{
          presentation: Platform.OS === 'ios' ? 'formSheet' : 'modal',
          ...(Platform.OS === 'ios'
            ? {
                sheetAllowedDetents: [1],
                sheetGrabberVisible: true,
                sheetCornerRadius: 12,
              }
            : {}),
          headerShown: true,
          headerLargeTitle: false,
          headerTitle: '',
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: true,
          headerTransparent: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />

      <Stack.Screen
        name="CalendarioSpaziStrutture"
        component={FacilitySpaceCalendarScreen}
        options={{
          headerShown: true,
          headerLargeTitle: false,
        }}
      />

      <Stack.Screen
        name="VistaCalendarioSpazio"
        component={FacilitySpaceTimelineScreen}
        options={{
          headerShown: true,
          headerLargeTitle: false,
        }}
      />

      <Stack.Screen
        name="NuovaPrenotazioneSpazio"
        component={NewFacilityBookingScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          headerLargeTitle: false,
          headerTitle: '',
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: true,
          headerTransparent: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />

      <Stack.Screen
        name="PrenotaSpaziEventi"
        component={BookingRequestsScreen}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="PrenotaSpaziStrutture"
        component={BookingRequestsScreen}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="PrenotaAulaForm"
        component={BookRoomScreen}
        options={{
          headerShown: true,
          headerLargeTitle: false,
          headerTitle: '',
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: true,
          headerTransparent: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
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
        name="RequestDetails"
        component={RequestDetailsScreen}
        options={{
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
