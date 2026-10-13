import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import {
  ContactsScreen as LibContactsScreen,
  PersonScreen,
  UsefulContactScreen,
  defaultUsefulContactsList,
} from '@polito/lib/features/people';
import { useTheme, useTitlesStyles } from '@polito/lib/ui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BookEventsForm } from './BookEventsForm';
import { BookEventsRoomScreen } from './BookEventsRoomScreen';
import { BookRoomForm } from './BookRoomForm';
import { BookRoomScreen } from './BookRoomScreen';
import { BookStructureForm } from './BookStructureForm';
import { BookStructureRoomScreen } from './BookStructureRoomScreen';
import { BookingScreen } from './BookingScreen';
import { ContactScreen } from './ContactScreen';
import { DigitalSignatureScreen } from './DigitalSignatureScreen';
import { EmergencyDetails } from './EmergencyDetails';
import { EmergencyScreen } from './EmergencyScreen';
import { IssueDetails } from './IssueDetails';
import { IssueReport } from './IssueReport';
import { IssueReportForm } from './IssueReportForm';
import { ServiceScreen } from './ServiceScreen';
import { SignatureScreen } from './SignatureScreen';
import { SingleBooking0 } from './SingleBooking0';
import { SingleBooking1 } from './SingleBooking1';
import { SingleBooking2 } from './SingleBooking2';
import { SupportScreen } from './SupportScreen';

export type ProfileStackParamList = {
  Servizi: undefined;
  Contatto: undefined;
  Contacts: undefined;
  Person: { id: number };
  UsefulContact: { id: string };
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

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ServiceNavigator = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;
  const ContactsScreen = () => (
    <LibContactsScreen
      usefulContacts={defaultUsefulContactsList}
      usefulContactsVisibility="onSearchFocus"
    />
  );

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
        name="Contacts"
        component={ContactsScreen}
        options={{
          headerTitle: t('contactsScreen.title'),
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Person"
        component={PersonScreen}
        getId={({ params: { id } }) => id.toString()}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="UsefulContact"
        component={UsefulContactScreen}
        getId={({ params: { id } }) => id}
        options={{
          headerTitle: '',
          headerBackTitle: t('contactsScreen.title'),
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Contatto"
        component={ContactScreen}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Supporto"
        component={SupportScreen}
        options={{
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
        name="PrenotaAula"
        component={BookRoomScreen}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="PrenotaSpaziEventi"
        component={BookEventsRoomScreen}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="PrenotaSpaziStrutture"
        component={BookStructureRoomScreen}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="PrenotaAulaForm"
        component={BookRoomForm}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="PrenotaEventiForm"
        component={BookEventsForm}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="PrenotaStruttureForm"
        component={BookStructureForm}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="DigitalSignature"
        component={DigitalSignatureScreen}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Booking0"
        component={SingleBooking0}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Booking1"
        component={SingleBooking1}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Booking2"
        component={SingleBooking2}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="SignatureScreen"
        component={SignatureScreen}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="EmergencyDetails"
        component={EmergencyDetails}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="IssueReport"
        component={IssueReport}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="IssueDetails"
        component={IssueDetails}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="IssueReportForm"
        component={IssueReportForm}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};
