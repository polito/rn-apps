import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { resetNavigationStatusTo } from '@polito/lib/core';
import {
  MfaSettings,
  PolitoAuthenticatorContent,
} from '@polito/lib/features/auth';
import {
  AccessibilitySettingsScreen,
  HeaderLogoNoProps,
  TextButton,
  useTheme,
  useTitlesStyles,
} from '@polito/lib/ui';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { NotificationsScreen } from '../NotificationsScreen';
import { AddressFormScreen, AddressTarget } from './AddressFormScreen';
import { AppInfoScreen } from './AppInfoScreen';
import { IbanFormScreen } from './IbanFormScreen';
import { NewOverlayScreen } from './NewOverlayScreen';
import { PersonalInfoScreen } from './PersonalInfoScreen';
import { ProfileScreen } from './ProfileScreen';
import { PublicationsScreen } from './PublicationsScreen';
import { SettingsScreen } from './SettingsScreen';
import { WhatsNewScreen } from './WhatsNewScreen';

export type ProfileStackParamList = {
  Profilo: undefined;
  Settings: undefined;
  PersonalInfo: undefined;
  AddressForm: { target: AddressTarget };
  IbanForm: undefined;
  Notifications: undefined;
  Publications: undefined;
  AccessibilitySettings: undefined;
  AppInfo: undefined;
  WhatsNew: undefined;
  NewOverlay: { id: string };
  MfaSettings: undefined;
  PolitoAuthenticator: { activeView: 'enroll' };
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const MfaSettingsScreen = ({
  navigation,
}: NativeStackScreenProps<ProfileStackParamList, 'MfaSettings'>) => (
  <MfaSettings
    onEnroll={() =>
      navigation.navigate('PolitoAuthenticator', { activeView: 'enroll' })
    }
  />
);

const PolitoAuthenticatorScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<ProfileStackParamList, 'PolitoAuthenticator'>) => (
  <PolitoAuthenticatorContent
    activeView={route.params.activeView}
    onClose={() => navigation.goBack()}
    onMissingKey={() => navigation.navigate('Settings')}
    onSettingsEnrollmentComplete={() =>
      resetNavigationStatusTo(navigation, 'Profile', [
        { name: 'Profilo' },
        { name: 'Settings' },
        { name: 'MfaSettings' },
      ])
    }
  />
);

export const ProfileNavigator = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;

  const formModalOptions = ({
    navigation,
  }: {
    navigation: { goBack: () => void };
  }) => ({
    presentation: 'modal' as const,
    headerLeft: () => (
      <TextButton
        accessibilityRole="button"
        onPress={() => navigation.goBack()}
      >
        {t('common.close')}
      </TextButton>
    ),
  });

  return (
    <Stack.Navigator
      screenOptions={{
        headerLargeTitle: false,
        headerBackButtonDisplayMode: 'minimal',
        headerTitleAlign: 'center',
        headerTransparent: Platform.select({ ios: false }),
        headerLargeStyle: {
          backgroundColor: colors.background,
        },
        ...useTitlesStyles(theme),
      }}
    >
      <Stack.Screen name="Profilo" component={ProfileScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen
        name="AddressForm"
        component={AddressFormScreen}
        options={formModalOptions}
      />
      <Stack.Screen
        name="IbanForm"
        component={IbanFormScreen}
        options={formModalOptions}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Publications" component={PublicationsScreen} />
      <Stack.Screen
        name="AccessibilitySettings"
        component={AccessibilitySettingsScreen}
        options={{
          headerTitle: t('accessibilitySettingsScreen.fontSettingsTitle'),
        }}
      />
      <Stack.Screen
        name="AppInfo"
        component={AppInfoScreen}
        options={{ headerTitle: t('appInfoScreen.title') }}
      />
      <Stack.Screen
        name="WhatsNew"
        component={WhatsNewScreen}
        options={{ headerTitle: t('appInfoScreen.news') }}
      />
      <Stack.Screen
        name="NewOverlay"
        component={NewOverlayScreen}
        getId={({ params }) => params.id}
        options={{
          headerTitle: t('appInfoScreen.news'),
          headerLeft: HeaderLogoNoProps,
          headerBackVisible: false,
          presentation: 'modal',
          ...(Platform.OS === 'ios' && { sheetGrabberVisible: true }),
          contentStyle: { backgroundColor: colors.background },
        }}
      />
      <Stack.Screen
        name="MfaSettings"
        component={MfaSettingsScreen}
        options={{ headerTitle: t('settingsScreen.authenticatorTitle') }}
      />
      <Stack.Screen
        name="PolitoAuthenticator"
        component={PolitoAuthenticatorScreen}
        options={{
          headerTitle: t('mfaScreen.headerTitle'),
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
