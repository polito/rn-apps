import { useTranslation } from 'react-i18next';
import { Platform, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IS_IOS } from '@polito/lib/core';
import {
  ContactsScreen as LibContactsScreen,
  PersonScreen,
  UsefulContactScreen,
  defaultUsefulContactsList,
} from '@polito/lib/features/people';
import { useTheme, useTitlesStyles } from '@polito/lib/ui';
import {
  RouteProp,
  getFocusedRouteNameFromRoute,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootParamList } from '../../core/components/RootNavigator';
import { BookingScreen } from '../../features/bookings/screens/BookingScreen';
import { FacilitySpaceCalendarScreen } from '../../features/bookings/screens/FacilitySpaceCalendarScreen';
import { FacilitySpaceTimelineScreen } from '../../features/bookings/screens/FacilitySpaceTimelineScreen';
import { NewFacilityBookingScreen } from '../../features/bookings/screens/NewFacilityBookingScreen';
import { NewReservationScreen } from '../../features/bookings/screens/NewReservationScreen';
import { RequestDetailsScreen } from '../../features/bookings/screens/RequestDetailsScreen';
import { ContactScreen } from './ContactScreen';
import { DigitalSignatureScreen } from './DigitalSignatureScreen';
import { EmergencyDetails } from './EmergencyDetails';
import { EmergencyScreen } from './EmergencyScreen';
import { IssueDetails } from './IssueDetails';
import { IssueReport } from './IssueReport';
import { IssueReportForm } from './IssueReportForm';
import { ServiceScreen } from './ServiceScreen';
import { SignatureScreen } from './SignatureScreen';
import { SupportScreen } from './SupportScreen';

export type ProfileStackParamList = {
  Servizi: undefined;
  Contatto: undefined;
  Contacts: undefined;
  Person: { id: number };
  UsefulContact: { id: string };
  Supporto: undefined;
  Prenotazione: undefined;
  NuovaPrenotazione: undefined;
  CalendarioSpaziStrutture: undefined;
  VistaCalendarioSpazio: { spaceId: string };
  NuovaPrenotazioneSpazio: { spaceId: string; eventId?: string } | undefined;
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

// Per-screen effect-based hiding (useHideTabs / useFocusEffect) proved
// unreliable across this chain of screens on both platforms: independent
// screens each toggling the same parent tabBarStyle option can race against
// a sibling's cleanup. Computing it declaratively from the currently focused
// route avoids that entirely. Owned here (not in RootNavigator) since this
// navigator already registers these exact routes.
const HIDDEN_TAB_BAR_ROUTES = new Set([
  'CalendarioSpaziStrutture',
  'VistaCalendarioSpazio',
  'NuovaPrenotazioneSpazio',
]);

export const getServiceTabBarStyle = (
  route: RouteProp<RootParamList, 'Services'>,
  defaultStyle: StyleProp<ViewStyle>,
): StyleProp<ViewStyle> => {
  const focusedRouteName = getFocusedRouteNameFromRoute(route);
  return focusedRouteName && HIDDEN_TAB_BAR_ROUTES.has(focusedRouteName)
    ? { display: 'none' }
    : defaultStyle;
};

export const ServiceNavigator = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors, dark } = theme;
  const bookingsHeaderStyle = {
    backgroundColor: Platform.select({
      ios: undefined,
      android: dark ? colors.background : colors.headersBackground,
    }),
  };
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
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Person"
        component={PersonScreen}
        getId={({ params: { id } }) => id.toString()}
        options={{
          headerLeft: () => <CustomBackButton2 />,
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
          headerTitle: t('bookingsScreen.title'),
          headerTitleAlign: 'center',
          headerBackTitle: t('common.services'),
          headerTransparent: IS_IOS,
          headerShadowVisible: true,
          headerStyle: bookingsHeaderStyle,
        }}
      />

      <Stack.Screen
        name="NuovaPrenotazione"
        component={NewReservationScreen}
        options={{
          headerShown: true,
          headerTitle: t('bookingsScreen.title'),
          headerTitleAlign: 'center',
          headerBackTitle: t('common.services'),
          headerTransparent: IS_IOS,
          headerShadowVisible: true,
          headerStyle: bookingsHeaderStyle,
        }}
      />

      <Stack.Screen
        name="CalendarioSpaziStrutture"
        component={FacilitySpaceCalendarScreen}
        options={{
          headerShown: true,
          headerLargeTitle: false,
          headerTitle: t('bookingsScreen.facilitySpaceCalendar'),
          headerTitleAlign: 'center',
          headerBackTitle: '',
          headerBackButtonDisplayMode: 'minimal',
          headerTransparent: IS_IOS,
          headerShadowVisible: true,
          headerStyle: bookingsHeaderStyle,
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
          headerTitle: t('other.requestRoom'),
          headerTitleAlign: 'center',
          headerBackTitle: t('common.services'),
          headerTransparent: IS_IOS,
          headerShadowVisible: true,
          headerStyle: bookingsHeaderStyle,
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
