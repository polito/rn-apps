import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { UserNavigatorID } from '@polito/lib/core';
import { HeaderLogoNoProps, useTheme, useTitlesStyles } from '@polito/lib/ui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SharedScreens } from '../../../shared/navigation/SharedScreens';
import { DegreeTopTabsNavigator } from '../../offering/navigation/DegreeTopTabsNavigator';
import { OfferingStackParamList } from '../../services/components/ServicesNavigator';
import { NewsItemScreen } from '../../services/screens/NewsItemScreen';
import { CreateTicketScreen } from '../../tickets/screens/CreateTicketScreen';
import { AccessibilitySettingsScreen } from '../screens/AccessibilityFontSettingsScreen.tsx';
import { AppInfoScreen } from '../screens/AppInfoScreen.tsx';
import { MessageScreen } from '../screens/MessageScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { NewOverlayScreen } from '../screens/NewOverlayScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RequestESCScreen } from '../screens/RequestESCScreen.tsx';
import { SettingsScreen } from '../screens/SettingsScreen';
import { WhatsNewScreen } from '../screens/WhatsNewScreen';
import { MfaSettings } from './MfaSettings.tsx';

export type UserStackParamList = OfferingStackParamList & {
  Profile: { firstRequest?: boolean };
  Settings: undefined;
  AppInfo: undefined;
  WhatsNew: undefined;
  NewOverlay: { id: string };
  CreateTicket: {
    topicId?: number;
    subtopicId?: number;
  };
  MfaSettings: undefined;
  Messages: undefined;
  RequestESC: undefined;
  Message: {
    id: number;
  };
  MessagesModal: undefined;
  Notifications: undefined;
  Person: { id: number };
  NewsItem: { id: number };
};

const Stack = createNativeStackNavigator<
  UserStackParamList,
  typeof UserNavigatorID
>();

export const UserNavigator = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Stack.Navigator
      id={UserNavigatorID}
      screenOptions={{
        headerLargeTitle: false,
        headerTransparent: Platform.select({ ios: true }),
        headerLargeStyle: {
          backgroundColor: colors.background,
        },
        headerBlurEffect: 'systemUltraThinMaterial',
        ...useTitlesStyles(theme),
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ firstRequest: false }}
        options={{
          headerLeft: HeaderLogoNoProps,
          headerTitle: t('profileScreen.title'),
        }}
      />
      <Stack.Screen
        name="RequestESC"
        component={RequestESCScreen}
        options={{
          headerTitle: t('escRequestScreen.title'),
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerTitle: t('notificationsScreen.title'),
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: t('settingsScreen.title'),
        }}
      />
      <Stack.Screen
        name="AppInfo"
        component={AppInfoScreen}
        options={{
          headerTitle: t('appInfoScreen.title'),
          headerTitleAlign: Platform.select({ android: 'center' }),
        }}
      />
      <Stack.Screen
        name="CreateTicket"
        component={CreateTicketScreen}
        options={{
          headerLargeTitle: false,
          headerTitle: t('common.appFeedback'),
          headerTitleAlign: Platform.select({ android: 'center' }),
        }}
      />
      <Stack.Screen
        name="WhatsNew"
        component={WhatsNewScreen}
        options={{
          headerTitle: t('appInfoScreen.news'),
          headerBackTitle: t('profileScreen.title'),
          headerTitleAlign: Platform.select({ android: 'center' }),
          contentStyle: { backgroundColor: colors.background },
        }}
      />
      <Stack.Screen
        name="NewOverlay"
        component={NewOverlayScreen}
        getId={({ params }) => params.id}
        options={{
          headerTitle: t('appInfoScreen.news'),
          headerTitleAlign: 'center',
          headerLeft: HeaderLogoNoProps,
          headerBackVisible: false,
          headerTransparent: false,
          headerShadowVisible: true,
          presentation: 'modal',
          ...(Platform.OS === 'ios'
            ? {
                sheetGrabberVisible: true,
              }
            : {}),
          contentStyle: { backgroundColor: colors.background },
        }}
      />
      <Stack.Screen
        name="NewsItem"
        component={NewsItemScreen}
        getId={({ params: { id } }) => id.toString()}
        options={{
          headerTitle: t('newsScreen.title'),
          headerLargeTitle: false,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen
        name="AccessibilitySettings"
        component={AccessibilitySettingsScreen}
        options={{
          headerTitle: t('accessibilitySettingsScreen.fontSettingsTitle'),
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          headerTitle: t('messagesScreen.title'),
        }}
      />
      <Stack.Screen
        name="MfaSettings"
        component={MfaSettings}
        options={{
          headerTitle: t('settingsScreen.authenticatorTitle'),
        }}
      />
      <Stack.Screen
        name="Message"
        component={MessageScreen}
        getId={({ params }) => `${params.id}`}
        options={{
          headerTitle: t('messageScreen.title'),
          headerBackTitle: t('messageScreen.backTitle'),
        }}
      />
      <Stack.Screen
        name="Degree"
        component={DegreeTopTabsNavigator}
        getId={({ params: { id, year } }) => id + (year ?? '0')}
        options={{
          headerTitle: t('degreeScreen.title'),
          headerLargeTitle: false,
          headerTransparent: false,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          headerLargeStyle: {
            backgroundColor: colors.headersBackground,
          },
        }}
      />
      {SharedScreens()}
    </Stack.Navigator>
  );
};
