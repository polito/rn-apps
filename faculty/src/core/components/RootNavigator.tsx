import { useEffect, useMemo, useState } from 'react';
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
import {
  BottomTabBarButtonProps,
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import {
  NavigatorScreenParams,
  getFocusedRouteNameFromRoute,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
  const { updatePreference, accessibility } =
    usePreferencesContext<AppPreferences>();
  const campus = useGetCurrentCampus();
  const { data: sites } = useGetSites();
  const [tabBarIconSize, setTabBarIconSize] = useState(20);
  useEffect(() => {
    if (!campus && sites?.data?.length) {
      updatePreference('campusId', sites?.data[0].id);
    }
  }, [campus, sites?.data, updatePreference]);

  useEffect(() => {
    if (accessibility?.fontSize && accessibility.fontSize > 125) {
      setTabBarIconSize(accessibility.fontSize === 150 ? 30 : 40);
    } else {
      setTabBarIconSize(20);
    }
  }, [accessibility?.fontSize]);

  const [isDID, setIsDID] = useState(true);

  const teachingNavigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  const bottomNavigation =
    useNavigation<BottomTabNavigationProp<RootParamList>>();
  const placesNavigation = useNavigation<BottomTabNavigationProp<any>>();
  const instantAnimation = {
    animation: 'timing' as const,
    config: { duration: 0 },
  };

  const androidTabBarBottom = useMemo(
    () =>
      Platform.select({ android: { height: androidTabBarHeight + bottom } }),
    [bottom],
  );

  const renderTabButton =
    (onPress: () => void) => (props: BottomTabBarButtonProps) => (
      <PlatformPressable {...props} onPress={onPress} />
    );

  return (
    <TabNavigator.Navigator
      backBehavior="history"
      screenOptions={{
        tabBarShowLabel:
          accessibility?.fontSize && accessibility.fontSize > 125
            ? false
            : true,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarVisibilityAnimationConfig: {
          show: instantAnimation,
          hide: instantAnimation,
        },
        tabBarStyle: [styles.tabBarStyle, androidTabBarBottom],
        tabBarBackground: () => <TranslucentView fallbackOpacity={1} />,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarLabelStyle: [styles.tabBarLabelStyle],
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarBadgeStyle: styles.tabBarBadgeStyle,
      }}
    >
      {isDID ? (
        <TabNavigator.Screen
          name="Didattica"
          component={TeachingNavigator}
          options={({ route }) => ({
            headerShown: false,
            tabBarLabel: t('teachingScreen.title'),
            tabBarIcon: ({ color }) => (
              <Icon icon={faBookOpen} color={color} size={tabBarIconSize} />
            ),
            tabBarStyle: [
              styles.tabBarStyle,
              androidTabBarBottom,
              [
                'CourseFileMultiSelectScreen',
                'CourseFilesUploadScreen',
                'CourseFolderFilesScreen',
              ].includes(getFocusedRouteNameFromRoute(route) ?? '')
                ? { display: 'none' }
                : null,
            ],
            tabBarButton: renderTabButton(() => {
              setIsDID(true);
              teachingNavigation.navigate('Roles');
            }),
          })}
        />
      ) : (
        <TabNavigator.Screen
          name="Didattica"
          component={TeachingNavigator}
          options={({ route }) => ({
            headerShown: false,
            tabBarLabel: t('teachingScreen.title'),
            tabBarIcon: ({ color }) => (
              <Icon icon={faBookOpen} color={color} size={tabBarIconSize} />
            ),
            tabBarStyle: [
              styles.tabBarStyle,
              androidTabBarBottom,
              [
                'CourseFileMultiSelectScreen',
                'CourseFilesUploadScreen',
                'CourseFolderFilesScreen',
              ].includes(getFocusedRouteNameFromRoute(route) ?? '')
                ? { display: 'none' }
                : null,
            ],
            tabBarButton: renderTabButton(() => {
              setIsDID(true);
              bottomNavigation.navigate({
                name: 'Didattica',
                params: { screen: 'Roles' },
                merge: true,
              });
            }),
          })}
        />
      )}
      <TabNavigator.Screen
        name="Agenda"
        component={AgendaNavigator}
        options={{
          headerShown: false,
          tabBarLabel: t('agendaScreen.title'),
          tabBarIcon: ({ color }) => (
            <Icon icon={faCalendar} color={color} size={tabBarIconSize} />
          ),
          tabBarButton: renderTabButton(() => {
            setIsDID(false);
            bottomNavigation.navigate('Agenda', { screen: 'Agenda2' });
          }),
        }}
      />

      <TabNavigator.Screen
        name="Places"
        options={{
          headerShown: false,
          tabBarLabel: t('other.places'),
          tabBarIcon: ({ color }) => (
            <Icon icon={faCompass} color={color} size={tabBarIconSize} />
          ),
          tabBarButton: renderTabButton(() => {
            setIsDID(false);
            placesNavigation.navigate({
              name: 'Places',
              params: { screen: 'Places1' },
              merge: true,
            });
          }),
        }}
      >
        {() => <PlacesNavigator unreadMessagesModal={View} />}
      </TabNavigator.Screen>
      <TabNavigator.Screen
        name="Services"
        component={ServiceNavigator}
        options={{
          headerShown: false,
          tabBarLabel: t('other.services'),
          tabBarIcon: ({ color }) => (
            <Icon icon={faCircleInfo} color={color} size={tabBarIconSize} />
          ),
          tabBarButton: renderTabButton(() => {
            setIsDID(false);
            bottomNavigation.navigate('Services');
          }),
        }}
      />
      <TabNavigator.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          headerShown: false,
          tabBarLabel: t('other.profile'),
          tabBarIcon: ({ color }) => (
            <Icon icon={faUser} color={color} size={tabBarIconSize} />
          ),
          tabBarButton: renderTabButton(() => {
            setIsDID(false);
            bottomNavigation.navigate('Profile');
          }),
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
