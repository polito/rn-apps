import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import {
  faBookOpen,
  faCircleInfo,
  faCompass,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { usePreferencesContext } from '@polito/lib/core';
import {
  PlacesNavigator,
  PlacesStackParamList,
  useGetCurrentCampus,
  useGetSites,
} from '@polito/lib/features/places';
import {
  Icon,
  Theme,
  TranslucentView,
  tabBarStyle,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';

import {
  AgendaNavigator,
  AgendaStackParamList,
} from '../../screens/Agenda/AgendaNavigator';
import { ProfileNavigator } from '../../screens/Profile/ProfileNavigator';
import { ServiceNavigator } from '../../screens/Servizi/ServiceNavigator';
import {
  TeachingNavigator,
  TeachingStackParamList,
} from '../../screens/Teaching/TeachingNavigator';
import { AppPreferences } from '../types/preferences';

export type RootParamList = {
  Didattica: NavigatorScreenParams<TeachingStackParamList>;
  Agenda: NavigatorScreenParams<AgendaStackParamList>;
  Places: NavigatorScreenParams<PlacesStackParamList>;
  Services: undefined;
  Profile: undefined;
};
const TabNavigator = createBottomTabNavigator<RootParamList>();
const androidTabBarHeight = 60;

export const RootNavigator = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const styles = useStylesheet(createStyles);
  const { updatePreference } = usePreferencesContext<AppPreferences>();
  const campus = useGetCurrentCampus();
  const { data: sites } = useGetSites();
  useEffect(() => {
    if (!campus && sites?.data?.length) {
      updatePreference('campusId', sites?.data[0].id);
    }
  }, [campus, sites?.data, updatePreference]);

  const androidTabBarBottom = useMemo(
    () =>
      Platform.select({ android: { height: androidTabBarHeight + bottom } }),
    [bottom],
  );
  return (
    <TabNavigator.Navigator
      backBehavior="history"
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [styles.tabBarStyle, androidTabBarBottom],
        tabBarBackground: () => <TranslucentView fallbackOpacity={1} />,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarLabelStyle: [styles.tabBarLabelStyle],
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarBadgeStyle: styles.tabBarBadgeStyle,
      }}
    >
      <TabNavigator.Screen
        name="Didattica"
        component={TeachingNavigator}
        options={{
          tabBarLabel: t('teachingScreen.title'),
          tabBarIcon: ({ color }) => (
            <Icon icon={faBookOpen} color={color} size={20} />
          ),
        }}
      />
      <TabNavigator.Screen
        name="Agenda"
        component={AgendaNavigator}
        options={{
          tabBarLabel: t('agendaScreen.title'),
          tabBarIcon: ({ color }) => (
            <Icon icon={faCalendar} color={color} size={20} />
          ),
        }}
      />
      <TabNavigator.Screen
        name="Places"
        options={{
          tabBarLabel: t('other.places'),
          tabBarIcon: ({ color }) => (
            <Icon icon={faCompass} color={color} size={20} />
          ),
        }}
      >
        {() => <PlacesNavigator unreadMessagesModal={View} />}
      </TabNavigator.Screen>
      <TabNavigator.Screen
        name="Services"
        component={ServiceNavigator}
        options={{
          tabBarLabel: t('other.services'),
          tabBarIcon: ({ color }) => (
            <Icon icon={faCircleInfo} color={color} size={20} />
          ),
        }}
      />
      <TabNavigator.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: t('other.profile'),
          tabBarIcon: ({ color }) => (
            <Icon icon={faUser} color={color} size={20} />
          ),
        }}
      />
    </TabNavigator.Navigator>
  );
};

const createStyles = ({
  colors,
  palettes,
  fontFamilies,
  fontWeights,
  fontSizes,
}: Theme) =>
  StyleSheet.create({
    tabBarStyle: {
      ...tabBarStyle,
      position: 'absolute',
      borderTopColor: colors.divider,
    },
    tabBarItemStyle: {
      paddingVertical: 3,
    },
    // Theme-independent hardcoded color
    // eslint-disable-next-line react-native/no-color-literals
    tabBarBadgeStyle: {
      backgroundColor: palettes.rose[600],
      color: 'white',
      top: -2,
      fontFamily: fontFamilies.body,
      fontWeight: fontWeights.semibold,
      fontSize: fontSizes.sm,
    },
    tabBarLabelStyle: {
      width: 'auto',
    },
  });
