import { Platform } from 'react-native';

import {
  AccessibilitySettingsScreen,
  HeaderLogoNoProps,
  createHeaderCloseButton,
  useTheme,
  useTitlesStyles,
} from '@polito/lib/ui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NotificationsScreen } from '../NotificationsScreen';
import { ContactsScreen, PersonalInfoScreen } from './PersonalInfoScreen';
import { ProfileFieldKey, ProfileForm, ProfileSectionKey } from './ProfileForm';
import { ProfileScreen } from './ProfileScreen';
import { PublicationsScreen } from './PublicationsScreen';
import { SettingsScreen } from './SettingsScreen';

export type ProfileStackParamList = {
  Profilo: undefined;
  Form: undefined;
  ProfileForm:
    | {
        section?: ProfileSectionKey;
        field?: ProfileFieldKey;
      }
    | undefined;
  Settings: undefined;
  PersonalInfo: undefined;
  Contacts: undefined;
  Notifications: undefined;
  Publications: undefined;
  AccessibilitySettings: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator = () => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Stack.Navigator
      screenOptions={{
        headerLargeTitle: false,
        headerBackButtonDisplayMode: 'minimal',
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
        options={({ navigation }) => ({
          headerLargeTitle: false,
          presentation: 'modal',
          headerLeft: HeaderLogoNoProps,
          headerRight: createHeaderCloseButton(navigation),
        })}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Publications" component={PublicationsScreen} />
      <Stack.Screen
        name="AccessibilitySettings"
        component={AccessibilitySettingsScreen}
      />
    </Stack.Navigator>
  );
};
