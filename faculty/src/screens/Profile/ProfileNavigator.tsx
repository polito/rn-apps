import { Platform, TouchableOpacity } from 'react-native';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '../../../../lib/src/ui/hooks/useTheme';
import { useTitlesStyles } from '../../../../lib/src/ui/hooks/useTitlesStyles';
import { NotificationsScreen } from '../NotificationsScreen';
import { ContactsScreen } from '../Servizi/ContactScreen';
import { AccessibilitySettingsScreen } from './AccessibilityFontSettingsScreen';
import { PersonalInfoScreen } from './PersonalInfoScreen';
import { ProfileForm } from './ProfileForm';
import { ProfileScreen } from './ProfileScreen';
import { PublicationsScreen } from './PublicationsScreen';
import { SettingsScreen } from './SettingsScreen';

export type ProfileStackParamList = {
  Profilo: undefined;
  Form: undefined;
  ProfileForm: undefined;
  Settings: undefined;
  PersonalInfo: undefined;
  Contacts: undefined;
  Notifications: undefined;
  Publications: undefined;
  AccessibilitySettings: undefined;
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

export const ProfileNavigator = () => {
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
      <Stack.Screen name="Profilo" component={ProfileScreen} />
      <Stack.Screen
        name="ProfileForm"
        component={ProfileForm}
        options={{
          presentation: 'modal',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="PersonalInfo"
        component={PersonalInfoScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Publications"
        component={PublicationsScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AccessibilitySettings"
        component={AccessibilitySettingsScreen}
        options={{
          headerLeft: () => <CustomBackButton2 />,
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};
